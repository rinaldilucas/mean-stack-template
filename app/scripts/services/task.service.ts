import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { environment } from '@app/environments/environment';
import { ITask } from '@app/scripts/models/task.interface';
import { SharedService } from '@app/scripts/services/shared.service';
import { IQueryResult } from '@app/scripts/models/queryResult.interface';
import { AuthService } from '@app/scripts/services/auth.service';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
    emitTask: EventEmitter<ITask> = new EventEmitter<ITask>();
    private url: string = environment.baseUri + '/tasks';

    constructor (private http: HttpClient, private sharedService: SharedService, private authService: AuthService) {}

    listTasksByUser (pageSize: number, searchTerm?: string, pageIndex = 0, sortFilter?: string, sortDirection?: string): Promise<IQueryResult<ITask[]>> {
        const id = this.authService.getUserId();
        let url = `${this.url}/user/${id}?`;

        if (sortFilter) url += `sortFilter=${sortFilter}&sortDirection=${sortDirection}&`;
        if (pageSize) url += `pageSize=${pageSize}&`;
        if (pageIndex) url += `pageIndex=${pageIndex}&`;
        if (searchTerm) url += `searchTerm=${searchTerm}`;

        return lastValueFrom(this.http.get<IQueryResult<ITask[]>>(url).pipe(catchError(this.sharedService.errorHandler)));
    }

    filterTasksByUser (searchTerm: string): Promise<IQueryResult<ITask[]>> {
        const id = this.authService.getUserId();
        const url = `${this.url}/user/${id}?searchTerm=${searchTerm}`;

        return lastValueFrom(this.http.get<IQueryResult<ITask[]>>(url).pipe(catchError(this.sharedService.errorHandler)));
    }

    getTask (id: string): Promise<IQueryResult<ITask>> {
        const url = `${this.url}/${id}`;

        return lastValueFrom(this.http.get<IQueryResult<ITask>>(url).pipe(catchError(this.sharedService.errorHandler)));
    }

    createTask (task: ITask): Promise<IQueryResult<ITask>> {
        const url = `${this.url}`;

        return lastValueFrom(this.http.post<IQueryResult<ITask>>(url, task).pipe(catchError(this.sharedService.errorHandler)));
    }

    removeTask (task: ITask | string): Promise<IQueryResult<ITask>> {
        const id = typeof task === 'string' ? task : task._id;
        const url = `${this.url}/${id}`;

        return lastValueFrom(this.http.delete<IQueryResult<ITask>>(url).pipe(catchError(this.sharedService.errorHandler)));
    }

    updateTask (task: ITask): Promise<IQueryResult<ITask>> {
        const url = `${this.url}`;

        return lastValueFrom(this.http.put<IQueryResult<ITask>>(url, task).pipe(catchError(this.sharedService.errorHandler)));
    }
}
