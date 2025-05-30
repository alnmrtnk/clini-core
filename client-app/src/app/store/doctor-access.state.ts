import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { DoctorAccess } from '../models/doctor-access.model';
import { DoctorAccessService } from '../services/doctor-access.service';
import { tap } from 'rxjs/operators';
import { MedicalRecordGroupDto } from '../models/medical-record.model';

export class LoadAccesses {
  static readonly type = '[Access] Load';
  constructor() {}
}
export class AddAccess {
  static readonly type = '[Access] Add';
  constructor(public payload: Partial<DoctorAccess>) {}
}
export class SetDisplayedAccess {
  static readonly type = '[Access] Set Displayed Access';
  constructor(public displayedAccess: DoctorAccess | null = null) {}
}
export class DeleteAccess {
  static readonly type = '[Access] Delete';
  constructor(public id: string) {}
}

export class LoadSharedRecords {
  static readonly type = '[Access] Get Shared Records';
  constructor(public token: string | null) {}
}

export interface AccessStateModel {
  accesses: DoctorAccess[];
  displayedAccess: DoctorAccess | null;
  sharedRecords: MedicalRecordGroupDto[];
}

@State<AccessStateModel>({
  name: 'accesses',
  defaults: { accesses: [], displayedAccess: null, sharedRecords: [] },
})
@Injectable()
export class AccessState {
  constructor(private service: DoctorAccessService) {}

  @Selector()
  static accesses(state: AccessStateModel) {
    return state.accesses;
  }

  @Selector()
  static displayedAccess(state: AccessStateModel) {
    return state.displayedAccess;
  }

  @Selector()
  static sharedRecords(state: AccessStateModel) {
    return state.sharedRecords;
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
          displayedAccess: a,
        })
      )
    );
  }

  @Action(SetDisplayedAccess)
  reset(ctx: StateContext<AccessStateModel>, action: SetDisplayedAccess) {
    return ctx.patchState({
      displayedAccess: action.displayedAccess,
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

  @Action(LoadSharedRecords)
  loadShared(ctx: StateContext<AccessStateModel>, action: LoadSharedRecords) {
    return (
      action.token
        ? this.service.getSharedPublic(action.token)
        : this.service.getSharedPrivate()
    ).pipe(
      tap((sharedRecords) => {
        ctx.patchState({ sharedRecords });
      })
    );
  }
}
