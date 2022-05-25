import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { delay, tap } from 'rxjs';
import { AppState } from '../store/app.state';
import { TasksActions } from '../store/tasks';

export interface Task {
  id: number | null;
  name: string;
  done: boolean;
}

export interface State<T> {
  status: 'IDLE' | 'LOADING' | 'READY';
  results: T[];
  error: null | string;
}

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private API_URL = 'http://localhost:3000';

  public get tasks$() {
    return this.store.select((state) => state.tasks);
  }

  constructor(private http: HttpClient, private store: Store<AppState>) {
    this.getTasks().subscribe();
  }

  save(task: Task) {
    this.store.dispatch(TasksActions.loading());

    return task.id ? this.updateTask(task) : this.createTask(task);
  }

  remove(taskId: number) {
    this.store.dispatch(TasksActions.loading());

    return this.http.delete(this.API_URL + `/tasks/${taskId}`).pipe(
      tap(() => {
        this.store.dispatch(TasksActions.remove({ taskId }));
      })
    );
  }

  private getTasks() {
    this.store.dispatch(TasksActions.loading());

    return this.http.get<Task[]>(this.API_URL + '/tasks').pipe(
      delay(1000),
      tap((tasks) => {
        this.store.dispatch(TasksActions.updateList({ tasks }));
      })
    );
  }

  private updateTask(task: Task) {
    return this.http.put<Task>(this.API_URL + `/tasks/${task.id}`, task).pipe(
      tap((updatedTask) => {
        this.store.dispatch(TasksActions.update({ task: updatedTask }));
      })
    );
  }

  private createTask(task: Task) {
    return this.http.post<Task>(this.API_URL + `/tasks`, task).pipe(
      tap((task) => {
        this.store.dispatch(TasksActions.add({ task }));
      })
    );
  }
}
