import { Component, OnInit } from '@angular/core';
import { ITarea } from '../interfaces/i-tarea';
import { Chart } from 'chart.js/auto';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'task-info',
  templateUrl: './task-info.component.html',
  styleUrls: ['./task-info.component.css']
})
export class TaskInfoComponent implements OnInit {
  tasks_demo:ITarea[] = [
    {
      id:1,
      descripcion:"Así se verá una tarea sin realizar. En versión móvil, podrás deslizarte a través de la descripción para "+
      "leerla completa si es demasiado extensa.",
      realizada:false
    },
    {
      id:2,
      descripcion:"Puedes establecer una fecha límite, pero la tarea aparecerá en color rojo si no la realizaste en ese tiempo. "
      +"En tu lista aparecerán primero las tareas que vayan a prescribir antes para que no se te olviden.",
      realizada:false,
      fecha: new Date("2022-12-31T23:59:59")
    },
    {
      id:3,
      descripcion:"Las tareas que ya hayas realizado se marcarán en verde y aparecerán en una lista aparte. "
      +"Estas tareas se pueden volver a marcar como no realizadas, pudiendo así ser reutilizadas.",
      realizada:true,
      fecha: new Date("2023-09-28T14:00:00")
    }
  ];
  tareas!:number;
  chart: any = [];
  datos!:number[];

  constructor(private taskService:TaskService) { }
  ngOnInit(): void {
    this.taskService.getInfoTasks().subscribe(resp => {
      this.tareas = resp.total;
      this.datos = [resp.sin_realizar, resp.vencidas, resp.realizadas]
      this.createChart() // Datos del gráfico
    });
  }

  timeout = (tarea:ITarea) => tarea.fecha && new Date(tarea.fecha) < new Date()

  createChart() {
    this.chart = new Chart('canvas', {
      type: 'doughnut',
      data: {
        labels: ['Sin realizar', 'Vencidas', 'Realizadas'],
        datasets: [
          {
            data: this.datos,
            backgroundColor:["rgb(23, 162, 184, 0.8)", "rgb(220, 53, 69, 0.8)", "rgb(40, 167, 69, 0.8)"],
            hoverBackgroundColor: ["rgb(23, 162, 184)", "rgb(220, 53, 69)", "rgb(40, 167, 69)"]
          },
        ],
      },
    });
  }
}
