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
export class DeleteAccess {
  static readonly type = '[Access] Delete';
  constructor(public id: string) {}
}

export interface AccessStateModel {
  accesses: DoctorAccess[];
}

@State<AccessStateModel>({
  name: 'accesses',
  defaults: { accesses: [] },
})
@Injectable()
export class AccessState {
  constructor(private service: DoctorAccessService) {}

  @Selector()
  static accesses(state: AccessStateModel) {
    return state.accesses;
  }

  @Action(LoadAccesses)
  load(ctx: StateContext<AccessStateModel>) {
    return this.service
      .getAll()
      .pipe(tap((a) => ctx.setState({ accesses: a })));
  }

  @Action(AddAccess)
  add(ctx: StateContext<AccessStateModel>, action: AddAccess) {
    return this.service
      .create(action.payload)
      .pipe(
        tap((a) =>
          ctx.patchState({ accesses: [...ctx.getState().accesses, a] })
        )
      );
  }

  @Action(DeleteAccess)
  delete(ctx: StateContext<AccessStateModel>, action: DeleteAccess) {
    return this.service.delete(action.id).pipe(
      tap(() => {
        const accesses = ctx
          .getState()
          .accesses.filter((a) => a.id !== action.id);
        ctx.setState({ accesses });
      })
    );
  }
}
