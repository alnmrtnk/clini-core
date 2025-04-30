import { State, Action, StateContext, Selector } from '@ngxs/store';
import { MedicalRecord } from '../models/medical-record.model';
import { MedicalRecordService } from '../services/medical-record.service';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

export class LoadRecords {
  static readonly type = '[Record] Load';
  constructor(public userId: string) {}
}
export class AddRecord {
  static readonly type = '[Record] Add';
  constructor(public payload: Partial<MedicalRecord>) {}
}
export class UpdateRecord {
  static readonly type = '[Record] Update';
  constructor(public id: string, public changes: Partial<MedicalRecord>) {}
}
export class DeleteRecord {
  static readonly type = '[Record] Delete';
  constructor(public id: string) {}
}

export interface RecordsStateModel {
  records: MedicalRecord[];
}

@State<RecordsStateModel>({
  name: 'records',
  defaults: { records: [] },
})
@Injectable()
export class RecordsState {
  constructor(private recordService: MedicalRecordService) {}

  @Selector()
  static records(state: RecordsStateModel) {
    return state.records;
  }

  @Action(LoadRecords)
  load({ getState, setState }: StateContext<RecordsStateModel>, { userId }: LoadRecords) {
    return this.recordService
      .getByUser(userId)
      .pipe(tap((records) => setState({ ...getState(), records })));
  }

  @Action(AddRecord)
  add(
    { getState, patchState }: StateContext<RecordsStateModel>,
    { payload }: AddRecord
  ) {
    return this.recordService
      .create(payload)
      .pipe(
        tap((newRec) =>
          patchState({ records: [...getState().records, newRec] })
        )
      );
  }

  @Action(UpdateRecord)
  update(
    { getState, setState }: StateContext<RecordsStateModel>,
    { id, changes }: UpdateRecord
  ) {
    return this.recordService.update(id, changes).pipe(
      tap(() => {
        const records = getState().records.map((r) =>
          r.id === id ? { ...r, ...changes } : r
        );
        setState({ records });
      })
    );
  }

  @Action(DeleteRecord)
  delete(
    { getState, setState }: StateContext<RecordsStateModel>,
    { id }: DeleteRecord
  ) {
    return this.recordService
      .delete(id)
      .pipe(
        tap(() =>
          setState({ records: getState().records.filter((r) => r.id !== id) })
        )
      );
  }
}
