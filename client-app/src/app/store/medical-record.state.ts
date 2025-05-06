import { State, Action, StateContext, Selector } from '@ngxs/store';
import { MedicalRecord } from '../models/medical-record.model';
import { MedicalRecordService } from '../services/medical-record.service';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { RecordTypeService } from '../services/record-type.service';
import { RecordType } from '../models/record-type.model';

export class LoadRecords {
  static readonly type = '[Record] Load';
  constructor() {}
}

export class LoadRecord {
  static readonly type = '[Record] Load by Id';
  constructor(public id: string) {}
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

export class LoadRecordTypes {
  static readonly type = '[Record] Get Types';
  constructor() {}
}

export interface RecordsStateModel {
  selectedRecord: MedicalRecord | null;
  records: MedicalRecord[];
  recordTypes: RecordType[];
}

@State<RecordsStateModel>({
  name: 'records',
  defaults: { selectedRecord: null, records: [], recordTypes: [] },
})
@Injectable()
export class RecordsState {
  constructor(
    private recordService: MedicalRecordService,
    private recordTypeService: RecordTypeService
  ) {}

  @Selector()
  static records(state: RecordsStateModel) {
    return state.records;
  }

  @Selector()
  static selectedRecord(state: RecordsStateModel) {
    return state.selectedRecord;
  }

  @Action(LoadRecords)
  load({ getState, setState }: StateContext<RecordsStateModel>) {
    return this.recordService
      .getAll()
      .pipe(tap((records) => setState({ ...getState(), records })));
  }

  @Action(LoadRecord)
  loadRecord({ getState, setState }: StateContext<RecordsStateModel>, {id}: LoadRecord) {
    return this.recordService
      .getById(id)
      .pipe(tap((record) => setState({ ...getState(), selectedRecord: record })));
  }

  @Action(LoadRecordTypes)
  loadTypes({ getState, setState }: StateContext<RecordsStateModel>) {
    return this.recordTypeService
      .getAll()
      .pipe(tap((recordTypes) => setState({ ...getState(), recordTypes })));
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
        setState({ ...getState(), records });
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
          setState({ ...getState(), records: getState().records.filter((r) => r.id !== id) })
        )
      );
  }
}
