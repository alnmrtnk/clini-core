import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { DoctorAccess } from '../models/doctor-access.model';
import { DoctorAccessService } from '../services/doctor-access.service';
import { tap } from 'rxjs/operators';

export class LoadAccesses {
  static readonly type = '[Access] Load';
  constructor() {}
}
export class AddAccess {
  static readonly type = '[Access] Add';
  constructor(public payload: Partial<DoctorAccess>) {}
}
export class ResetCreatedAccess {
  static readonly type = '[Access] Reset Created';
  constructor() {}
}
export class DeleteAccess {
  static readonly type = '[Access] Delete';
  constructor(public id: string) {}
}

export interface AccessStateModel {
  accesses: DoctorAccess[];
  createdAccess: DoctorAccess | null;
}

@State<AccessStateModel>({
  name: 'accesses',
  defaults: { accesses: [], createdAccess: null },
})
@Injectable()
export class AccessState {
  constructor(private service: DoctorAccessService) {}

  @Selector()
  static accesses(state: AccessStateModel) {
    return state.accesses;
  }

  @Selector()
  static createdAccess(state: AccessStateModel) {
    return state.createdAccess;
  }

  @Action(LoadAccesses)
  load(ctx: StateContext<AccessStateModel>) {
    return this.service
      .getAllAccesses()
      .pipe(tap((a) => ctx.setState({ ...ctx.getState(), accesses: a })));
  }

  @Action(AddAccess)
  add(ctx: StateContext<AccessStateModel>, action: AddAccess) {
    return this.service.create(action.payload).pipe(
      tap((a) =>
        ctx.patchState({
          accesses: [...ctx.getState().accesses, a],
          createdAccess: a,
        })
      )
    );
  }

  @Action(ResetCreatedAccess)
  reset(ctx: StateContext<AccessStateModel>) {
    return ctx.patchState({
      createdAccess: null,
    });
  }

  @Action(DeleteAccess)
  delete(ctx: StateContext<AccessStateModel>, action: DeleteAccess) {
    return this.service.delete(action.id).pipe(
      tap(() => {
        ctx.dispatch(LoadAccesses);
      })
    );
  }
}
