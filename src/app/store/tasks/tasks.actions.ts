import { createAction, props } from '@ngrx/store';
import { Task } from 'src/app/tasks/tasks.service';

export class TasksActions {
  static loading = createAction('[Tasks] action in progress');

  static add = createAction('[Tasks] add task', props<{ task: Task }>());

  static update = createAction('[Tasks] update task', props<{ task: Task }>());

  static updateList = createAction(
    '[Tasks] update tasks list',
    props<{ tasks: Task[] }>()
  );

  static remove = createAction(
    '[Tasks] remove task',
    props<{ taskId: number }>()
  );
}
