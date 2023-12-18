import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Task } from './task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/tasks');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) { }

  findAll(): Observable<HttpResponse<Task[]>> {
    return this.http.get<Task[]>(`${this.resourceUrl}`, { observe: 'response' });
  }

  findDefaultTasksIds(): Observable<number[]> {
    return this.http.get<number[]>(`${this.resourceUrl}/default`);
  }
}
