import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { HealthMeasurement } from '../models/health-measurement.model';
import { HealthMeasurementService } from '../services/health-measurement.service';
import { tap } from 'rxjs/operators';

export class LoadMeasurements {
  static readonly type = '[Measurement] Load';
  constructor(public userId: string) {}
}
export class AddMeasurement {
  static readonly type = '[Measurement] Add';
  constructor(public payload: Partial<HealthMeasurement>) {}
}
export class UpdateMeasurement {
  static readonly type = '[Measurement] Update';
  constructor(public id: string, public changes: Partial<HealthMeasurement>) {}
}
export class DeleteMeasurement {
  static readonly type = '[Measurement] Delete';
  constructor(public id: string) {}
}

export interface MeasurementsStateModel {
  measurements: HealthMeasurement[];
}

@State<MeasurementsStateModel>({
  name: 'measurements',
  defaults: { measurements: [] },
})
@Injectable()
export class MeasurementsState {
  constructor(private service: HealthMeasurementService) {}

  @Selector()
  static measurements(state: MeasurementsStateModel) {
    return state.measurements;
  }

  @Action(LoadMeasurements)
  load(ctx: StateContext<MeasurementsStateModel>, action: LoadMeasurements) {
    return this.service
      .getByUser(action.userId)
      .pipe(tap((ms) => ctx.setState({ measurements: ms })));
  }

  @Action(AddMeasurement)
  add(ctx: StateContext<MeasurementsStateModel>, action: AddMeasurement) {
    return this.service
      .create(action.payload)
      .pipe(
        tap((m) =>
          ctx.patchState({ measurements: [...ctx.getState().measurements, m] })
        )
      );
  }

  @Action(UpdateMeasurement)
  update(ctx: StateContext<MeasurementsStateModel>, action: UpdateMeasurement) {
    return this.service.update(action.id, action.changes).pipe(
      tap(() => {
        const measurements = ctx
          .getState()
          .measurements.map((m) =>
            m.id === action.id ? { ...m, ...action.changes } : m
          );
        ctx.setState({ measurements });
      })
    );
  }

  @Action(DeleteMeasurement)
  delete(ctx: StateContext<MeasurementsStateModel>, action: DeleteMeasurement) {
    return this.service.delete(action.id).pipe(
      tap(() => {
        const measurements = ctx
          .getState()
          .measurements.filter((m) => m.id !== action.id);
        ctx.setState({ measurements });
      })
    );
  }
}
