import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {
  EsculabOrderDto,
  LabResultDto,
  PatientDto,
} from '../models/esculab.model';
import { EsculabService } from '../services/esculab.service';

export namespace EsculabActions {
  export class RequestCode {
    static readonly type = '[Esculab] Request Code';
    constructor(public phone: string) {}
  }

  export class AcceptToken {
    static readonly type = '[Esculab] Accept Token';
    constructor(public payload: { code: string }) {}
  }

  export class FindPatient {
    static readonly type = '[Esculab] Find Patient';
  }

  export class GetAllOrders {
    static readonly type = '[Esculab] Get All Orders';
  }

  export class GetOrderDetails {
    static readonly type = '[Esculab] Get Order Details';
    constructor(public orderId: number) {}
  }

  export class SetSelectedOrder {
    static readonly type = '[Esculab] Set Selected Order';
    constructor(public orderId: number) {}
  }

  export class ClearEsculabState {
    static readonly type = '[Esculab] Clear State';
  }

  export class SetError {
    static readonly type = '[Esculab] Set Error';
    constructor(public error: string) {}
  }

  export class ClearError {
    static readonly type = '[Esculab] Clear Error';
  }
}

export type EsculabStateModel = {
  loading: boolean;
  error?: string;
  uuid?: string;
  esculabToken?: string;
  patient?: PatientDto;
  orders: EsculabOrderDto[];
  selectedOrderId?: number;
  orderDetails: { [key: number]: LabResultDto[] };
};

@State<EsculabStateModel>({
  name: 'esculab',
  defaults: {
    loading: false,
    orders: [],
    orderDetails: {},
  },
})
@Injectable()
export class EsculabState {
  constructor(private esculabService: EsculabService) {}

  @Selector()
  static isLoading(state: EsculabStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static getError(state: EsculabStateModel): string | undefined {
    return state.error;
  }

  @Selector()
  static getEsculabToken(state: EsculabStateModel): string | undefined {
    return state.esculabToken ?? localStorage.getItem('esculab_token') ?? '';
  }

  @Selector()
  static getUuid(state: EsculabStateModel): string | undefined {
    return state.uuid;
  }

  @Selector()
  static getPatient(state: EsculabStateModel): PatientDto | undefined {
    return state.patient;
  }

  @Selector()
  static getAllOrders(state: EsculabStateModel): EsculabOrderDto[] {
    return state.orders;
  }

  @Selector()
  static getSelectedOrderId(state: EsculabStateModel): number | undefined {
    return state.selectedOrderId;
  }

  @Selector()
  static getOrderDetails(state: EsculabStateModel): {
    [key: number]: LabResultDto[];
  } {
    return state.orderDetails;
  }

  @Selector()
  static getSelectedOrderDetails(
    state: EsculabStateModel
  ): LabResultDto[] | undefined {
    if (!state.selectedOrderId) return undefined;
    return state.orderDetails[state.selectedOrderId];
  }

  @Selector()
  static isAuthenticated(state: EsculabStateModel): boolean {
    return !!state.esculabToken;
  }

  @Action(EsculabActions.RequestCode)
  requestCode(
    ctx: StateContext<EsculabStateModel>,
    action: EsculabActions.RequestCode
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true, error: undefined });

    return this.esculabService.requestVerificationCode(action.phone).pipe(
      tap((response) => {
        ctx.patchState({
          loading: false,
          uuid: response,
          error: undefined,
        });
      }),
      catchError((error) => {
        ctx.patchState({
          loading: false,
          error: error.message || 'Failed to request verification code',
        });
        return throwError(() => error);
      })
    );
  }

  @Action(EsculabActions.AcceptToken)
  acceptToken(
    ctx: StateContext<EsculabStateModel>,
    action: EsculabActions.AcceptToken
  ) {
    const state = ctx.getState();
    const uuid = state.uuid;

    if (!uuid) {
      ctx.patchState({
        error: 'No UUID found. Please request a verification code first.',
      });
      return;
    }

    ctx.patchState({ loading: true, error: undefined });

    return this.esculabService.verifyCode(uuid, action.payload.code).pipe(
      tap((token) => {
        ctx.patchState({
          loading: false,
          esculabToken: token,
          error: undefined,
        });

        localStorage.setItem('esculab_token', token);
      }),
      catchError((error) => {
        ctx.patchState({
          loading: false,
          error: error.message || 'Failed to verify code',
        });
        return throwError(() => error);
      })
    );
  }

  @Action(EsculabActions.FindPatient)
  findPatient(ctx: StateContext<EsculabStateModel>) {
    const state = ctx.getState();
    const token = state.esculabToken ?? localStorage.getItem('esculab_token');

    if (!token) {
      const error = new Error('No token found. Please authenticate first.');
      ctx.patchState({ error: error.message });
      return throwError(() => error);
    }

    ctx.patchState({ loading: true, error: undefined });

    return this.esculabService.findPatient(token).pipe(
      tap((patient) => {
        ctx.patchState({
          loading: false,
          patient,
          error: undefined,
        });
      }),
      catchError((error) => {
        ctx.patchState({
          loading: false,
          error: error.message || 'Failed to find patient',
        });
        return throwError(() => error);
      })
    );
  }

  @Action(EsculabActions.GetAllOrders)
  getAllOrders(ctx: StateContext<EsculabStateModel>) {
    const state = ctx.getState();
    const token = state.esculabToken ?? localStorage.getItem('esculab_token');

    if (!token) {
      ctx.patchState({
        error: 'No token found. Please authenticate first.',
      });
      return;
    }

    ctx.patchState({ loading: true, error: undefined });

    return this.esculabService.getLabOrders(token).pipe(
      tap((orders) => {
        ctx.patchState({
          loading: false,
          orders,
          error: undefined,
        });
      }),
      catchError((error) => {
        ctx.patchState({
          loading: false,
          error: error.message || 'Failed to get lab orders',
        });
        return throwError(() => error);
      })
    );
  }

  @Action(EsculabActions.GetOrderDetails)
  getOrderDetails(
    ctx: StateContext<EsculabStateModel>,
    action: EsculabActions.GetOrderDetails
  ) {
    const state = ctx.getState();
    const token = state.esculabToken ?? localStorage.getItem('esculab_token');
    const orderId = action.orderId;

    if (!token) {
      ctx.patchState({
        error: 'No token found. Please authenticate first.',
      });
      return;
    }

    if (state.orderDetails[orderId]) {
      return;
    }

    ctx.patchState({ loading: true, error: undefined });

    return this.esculabService.getOrderDetails(orderId, token).pipe(
      tap((details) => {
        const updatedOrderDetails = { ...state.orderDetails };
        updatedOrderDetails[orderId] = details;

        ctx.patchState({
          loading: false,
          orderDetails: updatedOrderDetails,
          error: undefined,
        });
      }),
      catchError((error) => {
        ctx.patchState({
          loading: false,
          error: error.message || `Failed to get details for order ${orderId}`,
        });
        return throwError(() => error);
      })
    );
  }

  @Action(EsculabActions.SetSelectedOrder)
  setSelectedOrder(
    ctx: StateContext<EsculabStateModel>,
    action: EsculabActions.SetSelectedOrder
  ) {
    ctx.patchState({
      selectedOrderId: action.orderId,
    });
  }

  @Action(EsculabActions.ClearEsculabState)
  clearState(ctx: StateContext<EsculabStateModel>) {
    ctx.setState({
      loading: false,
      orders: [],
      orderDetails: {},
    });
  }

  @Action(EsculabActions.SetError)
  setError(
    ctx: StateContext<EsculabStateModel>,
    action: EsculabActions.SetError
  ) {
    ctx.patchState({
      error: action.error,
    });
  }

  @Action(EsculabActions.ClearError)
  clearError(ctx: StateContext<EsculabStateModel>) {
    ctx.patchState({
      error: undefined,
    });
  }
}
