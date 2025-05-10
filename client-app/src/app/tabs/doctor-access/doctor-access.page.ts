import { Component, effect, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
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
  ResetCreatedAccess,
} from 'src/app/store/doctor-access.state';
import { QRCodeComponent } from 'angularx-qrcode';
import { DoctorAccessCardComponent } from '../shared/doctor-access-card/doctor-access-card.component';

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
  readonly accesses = toSignal(this.store.select(AccessState.accesses));
  readonly createdAccess = toSignal(
    this.store.select(AccessState.createdAccess)
  );

  currentSegment = 'active';
  accessForm: FormGroup;
  tomorrow: string = new Date(Date.now() + 86400000).toISOString();
  showAccessModal = false;

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

    effect(() => {
      if (this.createdAccess()) {
        this.showAccessModal = true;
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(new LoadAccesses());
  }

  calculateExpirationDate(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  }

  createAccess() {
    if (this.accessForm.valid) {
      const formValue = this.accessForm.value;

      const accessData: CreateDoctorAccess = {
        name: formValue.name,
        expiresAt: new Date(formValue.expiresAt),
        targetEmail: formValue.targetEmail || undefined,
      };

      this.store.dispatch(new AddAccess(accessData));
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
    this.showAccessModal = false;
    this.store.dispatch(new ResetCreatedAccess());
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
    const a = this.createdAccess();
    if (a) return `https://clinicore.app/access/${a.token}`;
    return '';
  }

  copyAccessLink() {
    const a = this.createdAccess();
    if (a) navigator.clipboard.writeText(this.getAccessLink());
    // Show toast or notification that link was copied
  }

  resendEmail() {
    const a = this.createdAccess();
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
