import { Component, inject, input, OnInit, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NewCommentInput } from '../../shared-medical-records.component';
import { CommonModule } from '@angular/common';
import { CreateDoctorCommentDto, DoctorCommentTypeDto } from 'src/app/models/doctor-comment.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { AddComment, DoctorCommentState } from 'src/app/store/doctor-comment.state';
import { Store } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';
import { LoadSharedRecords } from 'src/app/store/doctor-access.state';

@Component({
  selector: 'app-new-comment',
  templateUrl: './new-comment.component.html',
  styleUrls: ['./new-comment.component.scss'],
  imports: [IonicModule, FormsModule, CommonModule]
})
export class NewCommentComponent  implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);

  readonly newComments = input<Record<string, NewCommentInput>>({});
  readonly recordId = input<string>('');
  readonly token = input<string | null>(null);
  readonly type = input.required<'personal' | 'esculab'>();

  readonly commentTypes: Signal<DoctorCommentTypeDto[]> = toSignal(
    this.store.select(DoctorCommentState.types),
    {
      initialValue: [],
    }
  );

  constructor() { }

  ngOnInit() {}

  clearNewComment(recordId: string): void {
    this.newComments()[recordId] = { text: '', typeId: '', isPublic: false };
  }

  saveComment(recordId: string, recordType: 'esculab' | 'personal'): void {
    const input = this.newComments()[recordId];
    if (!input?.text.trim() || !input?.typeId) {
      return;
    }

    const dto: CreateDoctorCommentDto = {
      token: this.route.snapshot.paramMap.get('token') || undefined,
      ...(recordType === 'personal' ? {medicalRecordId: recordId} : {}),
      ...(recordType === 'esculab' ? {esculabRecordId: recordId} : {}),
      doctorCommentTypeId: input.typeId,
      content: input.text.trim(),
      date: new Date().toISOString(),
      isPublic: input.isPublic,
    };

    this.store.dispatch(new AddComment(dto)).subscribe(() => {
      this.clearNewComment(recordId);
      if (this.token()) {
        this.store.dispatch(new LoadSharedRecords(this.token()));
      } else {
        this.store.dispatch(new LoadSharedRecords(null));
      }
    });
  }
}
