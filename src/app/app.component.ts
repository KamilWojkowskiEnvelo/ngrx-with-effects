import { Component } from '@angular/core';
import { map, tap } from 'rxjs';
import { TasksService } from './tasks/tasks.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ngrx-with-effects';

  tasksCount$ = this.service.tasks$.pipe(map((state) => state.results.length));

  constructor(private service: TasksService) {}
}
