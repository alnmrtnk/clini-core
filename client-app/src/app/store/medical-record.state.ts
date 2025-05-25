import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { HttpEventType } from '@angular/common/http';

import { MedicalRecordService } from '../services/medical-record.service';
import { RecordTypeService } from '../services/record-type.service';
import type { MedicalRecord } from '../models/medical-record.model';
import type { RecordType } from '../models/record-type.model';
import type { CreateMedicalRecord } from '../models/medical-record.model';
import { of } from 'rxjs';

export class LoadRecords {
  static readonly type = '[Record] Load';
}
export class LoadRecord {
  static readonly type = '[Record] Load by Id';
  constructor(public id: string) {}
}
export class LoadRecordTypes {
  static readonly type = '[Record] Get Types';
}

export class AddRecord {
  static readonly type = '[Record] Add';
  constructor(public dto: CreateMedicalRecord, public files: File[]) {}
}

export interface RecordsStateModel {
  selectedRecord: MedicalRecord | null;
  records: MedicalRecord[];
  recordTypes: RecordType[];
  uploading: boolean;
  uploadingProgress: number;
}

@State<RecordsStateModel>({
  name: 'records',
  defaults: {
    selectedRecord: null,
    records: [],
    recordTypes: [],
    uploading: false,
    uploadingProgress: 0,
  },
})
@Injectable()
export class RecordsState {
  constructor(
    private recordService: MedicalRecordService,
    private recordTypeService: RecordTypeService,
    private store: Store
  ) {}

  @Selector() static records(s: RecordsStateModel) {
    return s.records;
  }
  @Selector() static recordTypes(s: RecordsStateModel) {
    return s.recordTypes;
  }
  @Selector() static selectedRecord(s: RecordsStateModel) {
    return s.selectedRecord;
  }
  @Selector() static uploading(s: RecordsStateModel) {
    return s.uploading;
  }
  @Selector() static uploadingProgress(s: RecordsStateModel) {
    return s.uploadingProgress;
  }

  @Action(LoadRecords)
  load(ctx: StateContext<RecordsStateModel>) {
    return this.recordService
      .getAll()
      .pipe(tap((records) => ctx.patchState({ records })));
  }

  @Action(LoadRecord)
  loadRecord(ctx: StateContext<RecordsStateModel>, { id }: LoadRecord) {
    return this.recordService
      .getById(id)
      .pipe(tap((record) => ctx.patchState({ selectedRecord: record })));
  }

  @Action(LoadRecordTypes)
  loadTypes(ctx: StateContext<RecordsStateModel>) {
    return this.recordTypeService
      .getAll()
      .pipe(tap((recordTypes) => ctx.patchState({ recordTypes })));
  }

  @Action(AddRecord)
  add(ctx: StateContext<RecordsStateModel>, { dto, files }: AddRecord) {
    ctx.patchState({ uploading: true, uploadingProgress: 0 });
    return this.recordService.upload(dto, files).pipe(
      tap((event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          const progress = Math.round((100 * event.loaded) / event.total);
          ctx.patchState({ uploadingProgress: progress });
        } else if (event.type === HttpEventType.Response) {
          ctx.patchState({ uploading: false, uploadingProgress: 100 });
          this.store.dispatch(new LoadRecords());
        }
      }),
      catchError(() => {
        ctx.patchState({ uploadingProgress: 0 });
        return of(null);
      })
    );
  }
}
