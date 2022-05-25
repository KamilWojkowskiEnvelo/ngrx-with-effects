import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs';
import { AppState } from '../store/app.state';
import { TasksActions } from '../store/tasks';
import { Task, TasksService } from './tasks.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent implements OnInit {
  vm$ = this.service.tasks$.pipe(
    map((state) => ({
      state,
      form: new FormGroup({
        tasks: new FormArray(
          state.results.length
            ? state.results.map((task) => this.createNewTaskGroup(task))
            : [this.createNewTaskGroup()]
        ),
      }),
    })),
    tap((vm) => {
      this.form = vm.form;
    })
  );

  private form!: FormGroup;

  constructor(private service: TasksService, private store: Store<AppState>) {}

  public get tasksArray() {
    return this.form.controls['tasks'] as FormArray;
  }

  public get tasksArrayControls() {
    return this.tasksArray.controls as FormGroup[];
  }

  ngOnInit(): void {}

  public addNewTask() {
    this.tasksArray.push(this.createNewTaskGroup());
  }

  public save(taskFormGroup: FormGroup) {
    taskFormGroup.patchValue({
      editMode: false,
    });

    taskFormGroup.disable();

    this.service.save(taskFormGroup.getRawValue()).subscribe();
  }

  public edit(taskFormGroup: FormGroup) {
    taskFormGroup.patchValue({
      editMode: true,
    });

    taskFormGroup.enable();
  }

  public remove(index: number, taskFormGroup: FormGroup) {
    if (!taskFormGroup.controls['name'].value || confirm('czy na pewno')) {
      this.tasksArray.removeAt(index);

      if (taskFormGroup.controls['id'].value) {
        this.store.dispatch(
          TasksActions.remove({ taskId: taskFormGroup.controls['id'].value })
        );
      }
    }
  }

  private createNewTaskGroup(task?: Task) {
    return new FormGroup({
      name: new FormControl({ value: task?.name || null, disabled: !!task }, [
        Validators.minLength(3),
      ]),
      editMode: new FormControl(!task?.id),
      done: new FormControl(task?.done || false),
      id: new FormControl(task?.id || null),
    });
  }
}
