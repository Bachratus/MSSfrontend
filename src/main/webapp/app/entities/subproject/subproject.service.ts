import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Subproject } from './subproject.model';

@Injectable({ providedIn: 'root' })
export class SubprojectService {
    protected resourceUrl = this.applicationConfigService.getEndpointFor('api/subprojects');

    constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) { }

    findAllForProject(id: number): Observable<HttpResponse<Subproject[]>> {
        return this.http.get<Subproject[]>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    addSubproject(subproject: Subproject): Observable<HttpResponse<Subproject>> {
        return this.http.post<Subproject>(`${this.resourceUrl}`, subproject, { observe: 'response' });
    }

    editSubproject(subproject: Subproject): Observable<HttpResponse<Subproject>> {
        return this.http.put<Subproject>(`${this.resourceUrl}`, subproject, { observe: 'response' });
    }

    deleteSubproject(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete<HttpResponse<{}>>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
