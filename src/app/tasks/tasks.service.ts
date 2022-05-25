import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, tap } from 'rxjs';

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

  private tasks = new BehaviorSubject<State<Task>>({
    status: 'IDLE',
    results: [],
    error: null,
  });

  public get tasks$() {
    return this.tasks.asObservable();
  }

  constructor(private http: HttpClient) {
    this.getTasks().subscribe();
  }

  save(task: Task) {
    this.setState('LOADING');

    return task.id ? this.updateTask(task) : this.createTask(task);
  }

  remove(taskId: number) {
    this.setState('LOADING');

    return this.http.delete(this.API_URL + `/tasks/${taskId}`).pipe(
      tap(() => {
        this.tasks.next({
          ...this.tasks.value,
          status: 'READY',
          results: this.tasks.value.results.filter(
            (task) => task.id !== taskId
          ),
        });
      })
    );
  }

  private getTasks() {
    this.setState('LOADING');

    return this.http.get<Task[]>(this.API_URL + '/tasks').pipe(
      delay(1000),
      map<Task[], State<Task>>((tasks) => ({
        error: null,
        results: tasks,
        status: 'READY',
      })),
      tap((state) => {
        this.tasks.next(state);
      })
    );
  }

  private setState(status: 'IDLE' | 'LOADING' | 'READY') {
    this.tasks.next({
      ...this.tasks.value,
      status,
    });
  }

  private updateTask(task: Task) {
    return this.http.put<Task>(this.API_URL + `/tasks/${task.id}`, task).pipe(
      tap((updatedTask) => {
        const updatedTasks = this.tasks.value.results.map((task) => {
          return task.id === updatedTask.id ? updatedTask : task;
        });
        this.tasks.next({
          ...this.tasks.value,
          status: 'READY',
          results: updatedTasks,
        });
      })
    );
  }

  private createTask(task: Task) {
    return this.http.post<Task>(this.API_URL + `/tasks`, task).pipe(
      tap((task) => {
        this.tasks.next({
          ...this.tasks.value,
          status: 'READY',
          results: [...this.tasks.value.results, task],
        });
      })
    );
  }
}
