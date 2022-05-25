import { createReducer, on } from '@ngrx/store';
import { TasksApiAction } from './tasks-api.actions';
import { TasksActions } from './tasks.actions';
import { TasksState } from './tasks.state';

const initialState: TasksState = {
  error: null,
  results: [],
  status: 'IDLE',
};

export const tasksReducer = createReducer(
  initialState,
  on(TasksActions.add, (state, { task }) => {
    return {
      ...state,
      results: [...state.results, task],
      status: 'READY',
    };
  }),
  on(TasksActions.updateList, (state, { tasks }) => {
    return {
      ...state,
      results: tasks,
      status: 'READY',
    };
  }),
  on(TasksActions.update, (state, { task: updatedTask }) => {
    return {
      ...state,
      results: state.results.map((task) => {
        return updatedTask.id === task.id ? updatedTask : task;
      }),
      status: 'READY',
    };
  }),
  on(TasksActions.remove, (state) => {
    return {
      ...state,
      error: null,
      status: 'LOADING',
    };
  }),
  on(TasksApiAction.taskRemoveSucceed, (state, { taskID }) => {
    return {
      ...state,
      status: 'READY',
      results: state.results.filter((task) => task.id !== taskID),
    };
  }),
  on(TasksApiAction.taskRemoveFailed, (state, { error }) => {
    return {
      ...state,
      status: 'READY',
      error,
    };
  }),
  on(TasksActions.loading, (state) => {
    return {
      ...state,
      status: 'LOADING',
    };
  })
);
