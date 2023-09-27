import { Component, OnInit } from '@angular/core';
import { IUsuario } from '../interfaces/i-usuario';
import { ITarea } from '../interfaces/i-tarea';
import { UserService } from '../services/user.service';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'task-add',
  templateUrl: './task-add.component.html',
  styleUrls: ['./task-add.component.css']
})
export class TaskAddComponent implements OnInit {
  user!:IUsuario;
  tarea!:ITarea;
  error:string|null = null;

  constructor(private userService:UserService, private taskService:TaskService,
    private authService:AuthService) {}

  ngOnInit(): void {
    this.userService.getUser().subscribe(u => {
      this.user = u;
      this.tarea = this.initTask();
    });
  }

  initTask():ITarea {
    return {
      descripcion: '',
      realizada: false
    };
  }

  addTask(tarea:ITarea) {
    this.taskService.addTask(tarea).subscribe({
      next:()=>this.authService.addAlert("alertTask", true, "Tarea creada correctamente", true),
      error:e=>this.error = (e.error.messages != undefined) ? e.error.messages.descripcion[0] : ''
    });
  }

  reset(datetime:HTMLInputElement) {
    this.tarea = this.initTask();
    datetime.value = "";
    this.error = null;
  }

  saveDate(datetime:string) {
    this.tarea.fecha = datetime ? new Date(datetime): undefined;
  }
}
