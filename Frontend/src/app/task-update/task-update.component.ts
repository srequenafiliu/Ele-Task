import { Component, OnInit } from '@angular/core';
import { IUsuario } from '../interfaces/i-usuario';
import { ITarea } from '../interfaces/i-tarea';
import { UserService } from '../services/user.service';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'task-update',
  templateUrl: './task-update.component.html',
  styleUrls: ['./task-update.component.css']
})
export class TaskUpdateComponent implements OnInit {
  user!:IUsuario;
  tarea!:ITarea;
  error:string|null = null;
  id_tarea:number = 1;
  datetime!:HTMLInputElement;

  constructor(private userService:UserService, private taskService:TaskService,
    private authService:AuthService) {}

  ngOnInit(): void {
    this.userService.getUser().subscribe(u =>this.user = u);
    this.getTarea()
  }

  getTarea() {
    this.datetime = <HTMLInputElement>document.getElementById('datetime');
    this.taskService.getTask(this.id_tarea).subscribe({
      next: resp => {
        this.tarea = resp;
        if (resp.fecha) {
          const fecha = new Date(resp.fecha)
          fecha.setHours(fecha.getHours()+2)
          this.datetime.value = resp.fecha ? fecha.toISOString().slice(0, -8) : ''
        }
        else this.datetime.value = ''
      },
      error: () => this.id_tarea = 0
    })
  }

  borrarTarea(){
    console.log("Todavía no hace nada");

  }

  addTask(tarea:ITarea, datetime:HTMLInputElement) {
    if (tarea.fecha) tarea.fecha.setHours(tarea.fecha.getHours()+2)
    this.taskService.addTask(tarea).subscribe({
      next:t=>{
        this.user.tareas?.push(t);
        this.authService.sendData(this.user);
        this.authService.addAlert("alertTask", true, "Tarea creada correctamente", true);
        this.reset(datetime)
      },
      error:e=>{
        console.log(tarea.fecha);
        this.error = (e.error.messages != undefined) ? e.error.messages.descripcion[0] : '';
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
    fecha_actual.setHours(fecha_actual.getHours()+2)
    return fecha_actual.toISOString().slice(0, -8);
  }
}
