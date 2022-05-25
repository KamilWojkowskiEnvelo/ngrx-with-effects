import { Component } from '@angular/core';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {
  tasks$ = this.service.tasks$;

  constructor(private service: TasksService) {}
}
