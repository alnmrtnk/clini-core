import { Component, computed, inject } from '@angular/core';
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
export class DoctorAccessPage {
  private readonly store = inject(Store);
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly accesses = toSignal(this.store.select(AccessState.accesses));
  readonly displayedAccess = toSignal(
    this.store.select(AccessState.displayedAccess)
  );

  currentSegment: 'active' | 'create' = 'active';
  accessForm: FormGroup;
  tomorrow: string = new Date(Date.now() + 86400000).toISOString();

  modalForCreated = false;

  showModal = computed(() => {
    const a = this.displayedAccess();
    return a !== null && a !== undefined;
  });

  constructor() {
    this.accessForm = this.formBuilder.group({
      name: ['', Validators.required],
      targetEmail: ['', Validators.email],
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

  onSegmentChanged(event: CustomEvent<SegmentChangeEventDetail>) {
    const newSeg = event.detail.value;

    if (newSeg === 'active' || newSeg === 'create') {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { segment: newSeg },
        queryParamsHandling: 'merge',
      });
      this.currentSegment = newSeg;
    }
  }

  calculateExpirationDate(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  }

  showAccessDetails(access: DoctorAccess) {
    this.modalForCreated = false;
    this.store.dispatch(new SetDisplayedAccess(access));
  }

  createAccess() {
    if (this.accessForm.valid) {
      const formValue = this.accessForm.value;

      const accessData: CreateDoctorAccess = {
        name: formValue.name,
        expiresAt: new Date(formValue.expiresAt),
        targetEmail: formValue.targetEmail || undefined,
      };

      this.modalForCreated = true;
      this.store.dispatch(new AddAccess(accessData));
      console.log(this.modalForCreated);
    }
  }

  revokeAccess(accessId: string) {
    this.store.dispatch(new DeleteAccess(accessId));
  }

  onRenew({ id }: { id: string }) {
    const accesses = this.accesses();

    if (accesses) {
      const old = accesses.find((a) => a.id === id)!;

      this.accessForm.patchValue({
        name: old.name,
        targetEmail: old.targetEmail ?? '',
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
      targetEmail: '',
      duration: '7',
      expiresAt: this.calculateExpirationDate(7),
    });
  }

  getAccessLink() {
    const a = this.displayedAccess();
    if (a) return `https://clinicore.app/access/${a.token}`;
    return '';
  }

  copyAccessLink() {
    const a = this.displayedAccess();
    if (a) navigator.clipboard.writeText(this.getAccessLink());
    // Show toast or notification that link was copied
  }

  resendEmail() {
    const a = this.displayedAccess();
    if (a) console.log('Resending email for access:', a.id);
    // Show toast or notification that email was sent
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
