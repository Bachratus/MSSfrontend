import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Authority } from './authority.model';

@Injectable({ providedIn: 'root' })
export class AuthorityService {
  private resourceUrl = this.applicationConfigService.getEndpointFor('api/authority');

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) { }

  getAllAuthorities(): Observable<HttpResponse<Authority[]>> {
    return this.http.get<Authority[]>(`${this.resourceUrl}`, {observe: 'response'});
  }

  getAllForUser(userId: number): Observable<HttpResponse<Authority[]>> {
    return this.http.get<Authority[]>(`${this.resourceUrl}/${userId}`, {observe: 'response'});
  }
}
