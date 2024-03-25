import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Project } from './project.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
    protected resourceUrl = this.applicationConfigService.getEndpointFor('api/projects');

    constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) { }

    findAll(): Observable<HttpResponse<Project[]>> {
        return this.http.get<Project[]>(`${this.resourceUrl}`, { observe: 'response' });
    }

    addProject(project: Project): Observable<HttpResponse<Project>> {
        return this.http.post<Project>(`${this.resourceUrl}`, project, { observe: 'response' });
    }

    editProject(project: Project): Observable<HttpResponse<Project>> {
        return this.http.put<Project>(`${this.resourceUrl}`, project, { observe: 'response' });
    }

    deleteProject(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete<HttpResponse<{}>>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
