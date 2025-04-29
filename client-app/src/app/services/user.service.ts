import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { BaseEntityService } from './base-entity.service';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseEntityService<User> {
  protected override baseUrl = '/api/Users';
  constructor(http: HttpClient) {
    super(http);
  }
}
