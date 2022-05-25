import { createReducer, on } from '@ngrx/store';
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
  on(TasksActions.remove, (state, { taskId }) => {
    return {
      ...state,
      status: 'READY',
      results: state.results.filter((task) => task.id !== taskId),
    };
  }),
  on(TasksActions.loading, (state) => {
    return {
      ...state,
      status: 'LOADING',
    };
  })
);
