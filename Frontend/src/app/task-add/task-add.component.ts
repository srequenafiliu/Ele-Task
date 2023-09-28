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

  addTask(tarea:ITarea, datetime:HTMLInputElement) {
    if (tarea.fecha) tarea.fecha.setMinutes(tarea.fecha.getMinutes()-tarea.fecha.getTimezoneOffset())
    this.taskService.addTask(tarea).subscribe({
      next:t=>{
        this.user.tareas?.push(t);
        this.authService.sendData(this.user);
        this.authService.addAlert("alertTask", true, "Tarea creada correctamente", true);
        this.reset(datetime)
      },
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

  fechaActual():string {
    let fecha_actual:Date = new Date()
    fecha_actual.setMinutes(fecha_actual.getMinutes()-fecha_actual.getTimezoneOffset())
    return fecha_actual.toISOString().slice(0, -8);
  }
}
