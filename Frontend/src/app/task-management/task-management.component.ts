import { Component, OnInit } from '@angular/core';
import { IUsuario } from '../interfaces/i-usuario';
import { ITarea } from '../interfaces/i-tarea';
import { UserService } from '../services/user.service';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'task-management',
  templateUrl: './task-management.component.html',
  styleUrls: ['./task-management.component.css']
})
export class TaskManagementComponent implements OnInit {
  user!:IUsuario;
  tarea!:ITarea;
  error:string|null = null;
  id_tarea:number = 0;
  datetime!:HTMLInputElement;
  valor_datetime = ''
  fecha_tarea?:Date;


  constructor(private userService:UserService, private taskService:TaskService,
    private authService:AuthService) {}

  ngOnInit(): void {
    this.userService.getUser().subscribe(u =>this.user = u);
  }

  getTarea() {
    this.taskService.getTask(this.id_tarea).subscribe({
      next: resp => {
        this.tarea = resp;
        if (resp.fecha) {
          const fecha = new Date(resp.fecha)
          fecha.setMinutes(fecha.getMinutes()-fecha.getTimezoneOffset())
          this.valor_datetime = resp.fecha ? fecha.toISOString().slice(0, -8) : ''
          this.fecha_tarea = resp.fecha
        }
        else this.valor_datetime = ''
      },
      error: () => this.id_tarea = 0
    })
  }

  borrarTarea(){
    this.taskService.deleteTask(this.id_tarea).subscribe({
      next: () => {
        if (this.user.tareas) {
          const index = this.user.tareas.findIndex(t => t.id == this.id_tarea);
          if (index !== -1) this.user.tareas.splice(index, 1);
        }
        this.id_tarea = 0
        console.log(this.user.tareas);
        this.authService.sendData(this.user);
      },
      error: e=>console.log(e)
    })
  }

  updateTask(tarea:ITarea) {
    if (tarea.fecha && tarea.fecha != this.fecha_tarea)
      tarea.fecha.setMinutes(tarea.fecha.getMinutes()-tarea.fecha.getTimezoneOffset())
    else if (!tarea.fecha) tarea.fecha = undefined
    tarea.usuario = undefined;
    this.taskService.updateTask(tarea).subscribe({
      next:t=>{
        if (this.user.tareas) {
          const index = this.user.tareas.findIndex((tarea) => tarea.id == t.id);
          if (index !== -1) this.user.tareas[index] = t;
        }
        this.authService.sendData(this.user);
        this.authService.addAlert("alertTask", true, "Tarea actualizada correctamente", true);
        this.getTarea();
        this.error = null;
      },
      error:e=>{
        console.log(e);
        this.error = (e.error.messages != undefined) ? e.error.messages.descripcion[0] : ''
      }
    });
  }

  reset(datetime:HTMLInputElement) {
    this.getTarea();
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
