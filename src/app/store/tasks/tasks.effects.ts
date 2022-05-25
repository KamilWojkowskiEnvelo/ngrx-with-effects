import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { TasksService } from 'src/app/tasks/tasks.service';
import { TasksApiAction } from './tasks-api.actions';
import { TasksActions } from './tasks.actions';

@Injectable()
export class TasksEffects {
  remove$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TasksActions.remove),
        switchMap(({ taskId }) => {
          return this.service.remove(taskId).pipe(
            map(() => TasksApiAction.taskRemoveSucceed({ taskID: taskId })),
            catchError((error) =>
              of(TasksApiAction.taskRemoveFailed({ error }))
            )
          );
        })
      )

    // IMPORTANT: WHEN TO SET BELOW OPTION?
    // {
    //   dispatch: false,
    // }
  );

  constructor(private actions$: Actions, private service: TasksService) {}
}
