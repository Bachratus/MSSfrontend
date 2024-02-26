import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Task } from './task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/tasks');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) { }

  findDefaultTasksIds(): Observable<number[]> {
    return this.http.get<number[]>(`${this.resourceUrl}/default`);
  }

  findAll(): Observable<HttpResponse<Task[]>> {
    return this.http.get<Task[]>(`${this.resourceUrl}`, { observe: 'response' });
  }

  findAllForSubproject(id: number): Observable<HttpResponse<Task[]>> {
    return this.http.get<Task[]>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTask(task: Task): Observable<HttpResponse<Task>> {
    return this.http.post<Task>(`${this.resourceUrl}`, task, { observe: 'response' });
  }

  editTask(task: Task): Observable<HttpResponse<Task>> {
    return this.http.put<Task>(`${this.resourceUrl}`, task, { observe: 'response' });
  }

  deleteTask(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete<HttpResponse<{}>>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
