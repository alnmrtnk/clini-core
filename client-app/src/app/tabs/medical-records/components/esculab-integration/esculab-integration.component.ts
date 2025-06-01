import { Component, effect, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import {
  AcceptToken,
  ClearError,
  EsculabState,
  FindPatient,
  GetAllOrders,
  GetOrderDetails,
  RequestCode,
} from 'src/app/store/esculab.state';
import { EsculabOrderDto, LabResultDto } from 'src/app/models/esculab.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';

interface GroupedLabResults {
  name: string;
  date: string;
  results: LabResultDto[];
}

@Component({
  selector: 'app-esculab-integration',
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './esculab-integration.component.html',
  styleUrls: ['./esculab-integration.component.scss'],
})
export class EsculabIntegrationComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  readonly loading = toSignal(this.store.select(EsculabState.isLoading));
  readonly error = toSignal(this.store.select(EsculabState.getError));
  readonly orders = toSignal(this.store.select(EsculabState.getAllOrders));
  readonly orderDetails = toSignal(
    this.store.select(EsculabState.getOrderDetails)
  );
  readonly isAuthenticated = toSignal(
    this.store.select(EsculabState.isAuthenticated)
  );

  phoneForm: FormGroup;
  verificationForm: FormGroup;
  currentStep:  'phone' | 'verification' | 'results' = 'results';
  resendDisabled = false;
  resendCountdown = 0;
  countdownInterval: any;
  orderDetailsCache: { [key: number]: LabResultDto[] } = {};
  showOrderDetails = false;
  selectedOrder: EsculabOrderDto | null = null;
  groupedResults: GroupedLabResults[] = [];

  constructor() {
    this.phoneForm = this.formBuilder.group({
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^\+380\d{9}$/)],
      ],
    });

    this.verificationForm = this.formBuilder.group({
      verificationCode: [
        '',
        [Validators.required, Validators.pattern(/^\d{4}$/)],
      ],
    });

    effect(() => {
      if (this.isAuthenticated()) {
        this.currentStep = 'results';
        this.fetchLabOrders();
      }
    });

    effect(() => {
      const od = this.orderDetails();
      if (od) {
        this.orderDetailsCache = od;

        if (this.selectedOrder && od[this.selectedOrder.idOrder]) {
          this.groupResultsByPacket(od[this.selectedOrder.idOrder]);
        }
      }
    });

    this.fetchLabOrders();
  }

  submitPhone() {
    if (this.phoneForm.valid) {
      const phoneNumber = this.phoneForm.get('phoneNumber')?.value;

      this.store.dispatch(new ClearError());

      this.store.dispatch(new RequestCode(phoneNumber)).subscribe({
        next: () => {
          this.currentStep = 'verification';
          this.startResendCountdown();
        },
        error: () => {
          // Error is handled by the state and displayed via the error$ observable
        },
      });
    }
  }

  submitVerification() {
    if (this.verificationForm.valid) {
      const verificationCode =
        this.verificationForm.get('verificationCode')?.value;

      this.store.dispatch(new ClearError());

      this.store
        .dispatch(new AcceptToken({ code: verificationCode }))
        .subscribe({
          next: () => {
            this.currentStep = 'results';
            this.fetchLabOrders();
          },
          error: () => {
            // Error is handled by the state and displayed via the error$ observable
          },
        });
    }
  }

  resendCode() {
    if (!this.resendDisabled) {
      const phoneNumber = this.phoneForm.get('phoneNumber')?.value;

      this.store.dispatch(new ClearError());

      this.store.dispatch(new RequestCode(phoneNumber)).subscribe({
        next: () => {
          this.startResendCountdown();
        },
        error: () => {
          // Error is handled by the state and displayed via the error$ observable
        },
      });
    }
  }

  startResendCountdown() {
    this.resendDisabled = true;
    this.resendCountdown = 60;

    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    this.countdownInterval = setInterval(() => {
      this.resendCountdown--;
      if (this.resendCountdown <= 0) {
        this.resendDisabled = false;
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  goBack() {
    this.currentStep = 'phone';
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    this.store.dispatch(new ClearError());
  }

  fetchLabOrders() {
    this.store.dispatch(new FindPatient()).pipe(take(1)).subscribe({
      next: () => {
        this.currentStep = 'results';
        this.store.dispatch(new GetAllOrders());
      },
      error: () => {
        this.currentStep = 'phone';
      },
    });
  }

  loadOrderDetails(orderId: number) {
    this.store.dispatch(new GetOrderDetails(orderId));
  }

  getOrderDetails(orderId: number): LabResultDto[] | undefined {
    return this.orderDetailsCache[orderId];
  }

  viewOrderDetails(order: EsculabOrderDto) {
    this.selectedOrder = order;
    this.showOrderDetails = true;

    if (!this.orderDetailsCache[order.idOrder]) {
      this.store.dispatch(new GetOrderDetails(order.idOrder));
    } else {
      this.groupResultsByPacket(this.orderDetailsCache[order.idOrder]);
    }
  }

  closeOrderDetails() {
    this.showOrderDetails = false;
    this.selectedOrder = null;
    this.groupedResults = [];
  }

  groupResultsByPacket(results: LabResultDto[]) {
    const groupMap = new Map<string, LabResultDto[]>();

    results.forEach((result) => {
      const packetName = result.packet || 'Other Tests';
      if (!groupMap.has(packetName)) {
        groupMap.set(packetName, []);
      }
      groupMap.get(packetName)?.push(result);
    });

    this.groupedResults = Array.from(groupMap.entries()).map(
      ([name, results]) => {
        const date = results[0]?.utime
          ? this.formatDateTime(results[0].utime)
          : '';

        return {
          name,
          date,
          results,
        };
      }
    );
  }

  formatDateTime(date: Date): string {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  formatNormRange(normString: string | undefined): string {
    if (!normString) return 'Not specified';

    try {
      const normObj = JSON.parse(normString.replace(/'/g, '"'));
      return Object.keys(normObj)
        .map((key) => key)
        .join(', ');
    } catch (e) {
      return normString.replace(/[{}"]/g, '');
    }
  }

  downloadResults() {
    // Implement PDF download functionality
    console.log('Downloading results for order:', this.selectedOrder?.idOrder);
    // In a real app, this would generate and download a PDF
  }

  importToMedicalRecords(order: EsculabOrderDto) {
    this.closeOrderDetails();

    this.router.navigate(['/tabs/medical-records/add'], {
      queryParams: {
        type: 'labTest',
        source: 'esculab',
        orderId: order.idOrder,
        date: order.dt,
        title: order.packet,
      },
    });
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}
