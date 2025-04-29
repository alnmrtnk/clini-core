import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { tap } from 'rxjs/operators';

export class LoadUsers {
  static readonly type = '[User] Load';
}
export class AddUser {
  static readonly type = '[User] Add';
  constructor(public payload: Partial<User>) {}
}
export class UpdateUser {
  static readonly type = '[User] Update';
  constructor(public id: string, public changes: Partial<User>) {}
}
export class DeleteUser {
  static readonly type = '[User] Delete';
  constructor(public id: string) {}
}

export interface UsersStateModel {
  users: User[];
}

@State<UsersStateModel>({
  name: 'users',
  defaults: { users: [] },
})
@Injectable()
export class UsersState {
  constructor(private userService: UserService) {}

  @Selector()
  static getUsers(state: UsersStateModel) {
    return state.users;
  }

  @Action(LoadUsers)
  load({ getState, setState }: StateContext<UsersStateModel>) {
    return this.userService.getAll().pipe(tap((users) => setState({ users })));
  }

  @Action(AddUser)
  add(
    { getState, patchState }: StateContext<UsersStateModel>,
    { payload }: AddUser
  ) {
    return this.userService
      .create(payload)
      .pipe(
        tap((newUser) => patchState({ users: [...getState().users, newUser] }))
      );
  }

  @Action(UpdateUser)
  update(
    { getState, setState }: StateContext<UsersStateModel>,
    { id, changes }: UpdateUser
  ) {
    return this.userService.update(id, changes).pipe(
      tap(() => {
        const users = getState().users.map((u) =>
          u.id === id ? { ...u, ...changes } : u
        );
        setState({ users });
      })
    );
  }

  @Action(DeleteUser)
  delete(
    { getState, setState }: StateContext<UsersStateModel>,
    { id }: DeleteUser
  ) {
    return this.userService.delete(id).pipe(
      tap(() => {
        setState({ users: getState().users.filter((u) => u.id !== id) });
      })
    );
  }
}
