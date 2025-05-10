import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { DoctorCommentService } from '../services/doctor-comment.service';
import { tap } from 'rxjs/operators';
import { CreateDoctorCommentDto, DoctorCommentDto, DoctorCommentTypeDto } from '../models/doctor-comment.model';
import { DoctorCommentTypeService } from '../services/doctor-comment-type.service';

export class LoadComments {
  static readonly type = '[DoctorComment] Load';
  constructor(public medicalRecordId: string) {}
}
export class LoadCommentTypes {
  static readonly type = '[DoctorComment] Load Types';
}
export class AddComment {
  static readonly type = '[DoctorComment] Add';
  constructor(public payload: CreateDoctorCommentDto) {}
}
export class UpdateComment {
  static readonly type = '[DoctorComment] Update';
  constructor(public id: string, public changes: Partial<DoctorCommentDto>) {}
}
export class DeleteComment {
  static readonly type = '[DoctorComment] Delete';
  constructor(public id: string) {}
}

export interface DoctorCommentStateModel {
  comments: DoctorCommentDto[];
  types: DoctorCommentTypeDto[];
}

@State<DoctorCommentStateModel>({
  name: 'doctorComments',
  defaults: {
    comments: [],
    types: []
  }
})
@Injectable()
export class DoctorCommentState {
  constructor(private svc: DoctorCommentService, private svcType: DoctorCommentTypeService) {}

  @Selector()
  static comments(state: DoctorCommentStateModel) {
    return state.comments;
  }

  @Selector()
  static types(state: DoctorCommentStateModel) {
    return state.types;
  }

  @Action(LoadComments)
  loadComments(ctx: StateContext<DoctorCommentStateModel>, action: LoadComments) {
    return this.svc.getByRecord(action.medicalRecordId).pipe(
      tap(comments => ctx.patchState({ comments }))
    );
  }

  @Action(LoadCommentTypes)
  loadTypes(ctx: StateContext<DoctorCommentStateModel>) {
    return this.svcType.getTypes().pipe(
      tap(types => ctx.patchState({ types }))
    );
  }

  @Action(AddComment)
  addComment(ctx: StateContext<DoctorCommentStateModel>, action: AddComment) {
    return this.svc.createComment(action.payload).pipe(
      tap(comment =>
        ctx.patchState({
          comments: [...ctx.getState().comments, comment]
        })
      )
    );
  }

  @Action(UpdateComment)
  updateComment(ctx: StateContext<DoctorCommentStateModel>, action: UpdateComment) {
    return this.svc.updateComment(action.id, action.changes).pipe(
      tap(() => {
        const updated = ctx.getState().comments.map(c =>
          c.id === action.id ? { ...c, ...action.changes } as DoctorCommentDto : c
        );
        ctx.patchState({ comments: updated });
      })
    );
  }

  @Action(DeleteComment)
  deleteComment(ctx: StateContext<DoctorCommentStateModel>, action: DeleteComment) {
    return this.svc.deleteComment(action.id).pipe(
      tap(() => {
        const filtered = ctx.getState().comments.filter(c => c.id !== action.id);
        ctx.patchState({ comments: filtered });
      })
    );
  }
}
