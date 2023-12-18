import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { User } from './user.model';
import { Authority } from '../authority/authority.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private resourceUrl = this.applicationConfigService.getEndpointFor('api/users');

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.resourceUrl}`);
  }

  deleteUser(login: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${login}`, { observe: 'response' })
  }

  updateUser(user: User): Observable<HttpResponse<User>> {
    return this.http.put<User>(`${this.resourceUrl}`, user, { observe: 'response' });
  }

  registerUser(user: User): Observable<HttpResponse<{}>> {
    return this.http.post(`${this.resourceUrl}`, user, { observe: 'response' });
  }

  updateUserAuthorities(userId: number, authorities: Authority[]): Observable<HttpResponse<User>> {
    return this.http.put<User>(`${this.resourceUrl}/user-authorities/${userId}`, authorities, { observe: 'response' })
  }
}
