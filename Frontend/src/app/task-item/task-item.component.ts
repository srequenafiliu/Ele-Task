import { Component, Input } from '@angular/core';
import { ITarea } from '../interfaces/i-tarea';

@Component({
  selector: 'task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent {
  @Input() tarea!:ITarea;
  url:string = window.location.pathname
  timeout = ()  => this.tarea.fecha && new Date(this.tarea.fecha) < new Date();
}
