import { Task } from 'src/app/tasks/tasks.service';

export interface TasksState {
  status: 'IDLE' | 'LOADING' | 'READY';
  results: Task[];
  error: null | string;
}
