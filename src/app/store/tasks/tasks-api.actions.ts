import { createAction, props } from '@ngrx/store';

export class TasksApiAction {
  static taskRemoveSucceed = createAction(
    '[Tasks] removing task succeed',
    props<{ taskID: number }>()
  );
  static taskRemoveFailed = createAction(
    '[Tasks] removing task failed',
    props<{ error: any }>()
  );
}
