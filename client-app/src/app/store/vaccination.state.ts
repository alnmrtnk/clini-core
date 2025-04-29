import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Vaccination } from '../models/vaccination.model';
import { VaccinationService } from '../services/vaccination.service';
import { tap } from 'rxjs/operators';

export class LoadVaccinations {
  static readonly type = '[Vaccination] Load';
  constructor(public userId: string) {}
}
export class AddVaccination {
  static readonly type = '[Vaccination] Add';
  constructor(public payload: Partial<Vaccination>) {}
}
export class UpdateVaccination {
  static readonly type = '[Vaccination] Update';
  constructor(public id: string, public changes: Partial<Vaccination>) {}
}
export class DeleteVaccination {
  static readonly type = '[Vaccination] Delete';
  constructor(public id: string) {}
}

export interface VaccinationsStateModel {
  vaccinations: Vaccination[];
}

@State<VaccinationsStateModel>({
  name: 'vaccinations',
  defaults: { vaccinations: [] },
})
@Injectable()
export class VaccinationsState {
  constructor(private service: VaccinationService) {}

  @Selector()
  static vaccinations(state: VaccinationsStateModel) {
    return state.vaccinations;
  }

  @Action(LoadVaccinations)
  load(ctx: StateContext<VaccinationsStateModel>, action: LoadVaccinations) {
    return this.service
      .getByUser(action.userId)
      .pipe(tap((vacs) => ctx.setState({ vaccinations: vacs })));
  }

  @Action(AddVaccination)
  add(ctx: StateContext<VaccinationsStateModel>, action: AddVaccination) {
    return this.service
      .create(action.payload)
      .pipe(
        tap((vac) =>
          ctx.patchState({
            vaccinations: [...ctx.getState().vaccinations, vac],
          })
        )
      );
  }

  @Action(UpdateVaccination)
  update(ctx: StateContext<VaccinationsStateModel>, action: UpdateVaccination) {
    return this.service.update(action.id, action.changes).pipe(
      tap(() => {
        const vaccinations = ctx
          .getState()
          .vaccinations.map((v) =>
            v.id === action.id ? { ...v, ...action.changes } : v
          );
        ctx.setState({ vaccinations });
      })
    );
  }

  @Action(DeleteVaccination)
  delete(ctx: StateContext<VaccinationsStateModel>, action: DeleteVaccination) {
    return this.service.delete(action.id).pipe(
      tap(() => {
        const vaccinations = ctx
          .getState()
          .vaccinations.filter((v) => v.id !== action.id);
        ctx.setState({ vaccinations });
      })
    );
  }
}
