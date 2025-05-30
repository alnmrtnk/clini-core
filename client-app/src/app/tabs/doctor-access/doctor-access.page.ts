import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IonicModule, SegmentChangeEventDetail } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import {
  CreateDoctorAccess,
  DoctorAccess,
} from 'src/app/models/doctor-access.model';
import {
  AccessState,
  AddAccess,
  DeleteAccess,
  LoadAccesses,
  SetDisplayedAccess,
} from 'src/app/store/doctor-access.state';
import { QRCodeComponent } from 'angularx-qrcode';
import { DoctorAccessCardComponent } from '../shared/doctor-access-card/doctor-access-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-doctor-access',
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    DoctorAccessCardComponent,
    ReactiveFormsModule,
    QRCodeComponent,
  ],
  templateUrl: 'doctor-access.page.html',
  styleUrl: 'doctor-access.page.scss',
})
export class DoctorAccessPage implements OnInit, AfterViewInit {
  private readonly store = inject(Store);
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toastCtrl = inject(ToastController);

  readonly accesses = toSignal(this.store.select(AccessState.accesses));
  readonly displayedAccess = toSignal(
    this.store.select(AccessState.displayedAccess)
  );

  currentSegment: 'active' | 'create' = 'active';
  accessForm: FormGroup;
  tomorrow: string = new Date(Date.now() + 86400000).toISOString();

  modalForCreated = false;

  @ViewChild('seg', { read: ElementRef }) segEl!: ElementRef<HTMLElement>;

  showModal = computed(() => {
    const a = this.displayedAccess();
    return a !== null && a !== undefined;
  });

  constructor() {
    this.accessForm = this.formBuilder.group({
      name: ['', Validators.required],
      targetUserEmail: ['', Validators.email],
      duration: ['7', Validators.required],
      expiresAt: [this.calculateExpirationDate(7), Validators.required],
    });

    this.accessForm.get('duration')?.valueChanges.subscribe((value) => {
      if (value !== 'custom') {
        const days = Number.parseInt(value);
        this.accessForm
          .get('expiresAt')
          ?.setValue(this.calculateExpirationDate(days));
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(new LoadAccesses());

    this.route.queryParamMap.subscribe((params) => {
      const seg = params.get('segment');
      if (seg === 'active' || seg === 'create') {
        this.currentSegment = seg;
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.updateBg(), 0);
  }

  onSegmentChanged(event: CustomEvent<SegmentChangeEventDetail>) {
    const newSeg = event.detail.value as 'active' | 'create';
    this.currentSegment = newSeg;
    if (newSeg === 'active' || newSeg === 'create') {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { segment: newSeg },
        queryParamsHandling: 'merge',
      });
    }
    setTimeout(() => this.updateBg(), 0);
  }

  private updateBg() {
    const host = this.segEl.nativeElement;
    const active = host.querySelector<HTMLElement>('.segment-button-checked');
    if (!active) {
      const btn = host.querySelector<HTMLElement>('.in-segment');
      console.log(btn!.getBoundingClientRect().width);
      host.style.setProperty('--bg-left', `4px`);
      host.style.setProperty(
        '--bg-width',
        `${btn!.getBoundingClientRect().width}px`
      );
      return;
    }

    const hostRect = host.getBoundingClientRect();
    const btnRect = active.getBoundingClientRect();

    const left = btnRect.left - hostRect.left;
    const width = btnRect.width;

    host.style.setProperty('--bg-left', `${left}px`);
    host.style.setProperty('--bg-width', `${width}px`);
  }

  calculateExpirationDate(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  }

  showAccessDetails(access: DoctorAccess) {
    if (
      !access.revoked &&
      !!access.token &&
      new Date(access.expiresAt) > new Date()
    ) {
      this.modalForCreated = false;
      this.store.dispatch(new SetDisplayedAccess(access));
    }
  }

  async createAccess() {
    if (this.accessForm.valid) {
      const formValue = this.accessForm.value;

      const accessData: CreateDoctorAccess = {
        name: formValue.name,
        expiresAt: new Date(formValue.expiresAt),
        targetUserEmail: formValue.targetUserEmail || undefined,
      };

      this.modalForCreated = true;
      await this.store.dispatch(new AddAccess(accessData));
      const toast = await this.toastCtrl.create({
        message: 'New access created.',
        duration: 2000,
        position: 'bottom',
        icon: 'checkmark-circle-outline',
      });
      await toast.present();
    }
  }

  async revokeAccess(accessId: string) {
    await this.store.dispatch(new DeleteAccess(accessId));
    const toast = await this.toastCtrl.create({
      message: 'Access revoked.',
      duration: 2000,
      position: 'bottom',
      icon: 'trash-outline',
    });
    await toast.present();
  }

  onRenew({ id }: { id: string }) {
    const accesses = this.accesses();

    if (accesses) {
      const old = accesses.find((a) => a.id === id)!;

      this.accessForm.patchValue({
        name: old.name,
        targetUserEmail: old.targetUserEmail ?? '',
        duration: 'custom',
        expiresAt: this.calculateExpirationDate(7),
      });

      this.currentSegment = 'create';
    }
  }

  closeAccessModal() {
    this.store.dispatch(new SetDisplayedAccess());
    this.currentSegment = 'active';
  }

  resetForm() {
    this.accessForm.reset({
      name: '',
      targetUserEmail: '',
      duration: '7',
      expiresAt: this.calculateExpirationDate(7),
    });
  }

  getAccessLink() {
    const a = this.displayedAccess();
    if (a) return `http://localhost:4200/medical-records/${a.token}`;
    return '';
  }

  async copyAccessLink() {
    const a = this.displayedAccess();
    if (a) {
      await navigator.clipboard.writeText(this.getAccessLink());

      const toast = await this.toastCtrl.create({
        message: 'Access link copied to clipboard.',
        duration: 2000,
        position: 'bottom',
        icon: 'copy-outline',
      });
      await toast.present();
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
