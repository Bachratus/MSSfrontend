import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { SubprojectType } from './subproject-type.model';

@Injectable({ providedIn: 'root' })
export class SubprojectTypeService {
    protected resourceUrl = this.applicationConfigService.getEndpointFor('api/subproject-type');

    constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) { }

    findAll(): Observable<HttpResponse<SubprojectType[]>> {
        return this.http.get<SubprojectType[]>(`${this.resourceUrl}`, { observe: 'response' });
    }
}
