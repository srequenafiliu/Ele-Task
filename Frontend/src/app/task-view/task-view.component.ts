import { Component, Input, OnInit } from '@angular/core';
import { ITarea } from '../interfaces/i-tarea';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent implements OnInit {
  pag_true!:number;
  pag_false!:number;
  pag!:number;
  innerWidth = window.innerWidth;
  size = (this.innerWidth>960) ? 3 : 2;
  count!:number;
  tareas!:ITarea[];
  pages!:(string|number)[];
  @Input() realizadas!:number;

  constructor(private taskService:TaskService, private authService:AuthService,
    private route:ActivatedRoute, private router:Router) {
    this.route.queryParams.subscribe(params => {
      this.pag_true = (+params["pag_true"]) ? +params["pag_true"] : 1;
      this.pag_false = (+params["pag_false"]) ? +params["pag_false"] : 1;
      this.pag = this.realizadas == 1 ? this.pag_true : this.pag_false;
      if (this.realizadas != undefined) this.getTareas(this.pag);
    })
  }
  ngOnInit(): void {
    this.getTareas(this.pag);
  }

  getTareas(pagNum:number) {
    this.pag = (pagNum-1)*this.size>=this.count ? Math.ceil(this.count/this.size) : pagNum;
    this.taskService.getTasksUser(this.pag, this.size, this.realizadas).subscribe({
      next: r=>{
        this.count = r.count;
        this.tareas=r.result;
        const length = Math.ceil(r.count/this.size);
        this.pages = (length>7) ? this.getPages(this.pag_false, length) : Array(length).fill(1).map((_x, i)=>i+1);
      },
      error: e=>document.getElementById("server_error_r")?.appendChild(document.createTextNode(e)),
    });
  }

  getPages(pagActual:number, length:number) {
    switch (pagActual) {
      case 1: case 2: case length-1: case length: return [1, 2, 3, '...', length-2, length-1, length];
      case 3: return [1, 2, 3, 4, '...', length-1, length];
      case length-2: return [1, 2, "...", length-3, length-2, length-1, length];
      default: return [1, (pagActual == 4) ? 2 : '...', pagActual-1, pagActual, pagActual+1, (pagActual == length-3) ? length-1 : '...', length];
    }
  }

  getQueryParams(pagNum:number) {
    if (this.realizadas) this.pag_true = pagNum
    else this.pag_false = pagNum
    return {'pag_true': (this.pag_true !== 1) ? this.pag_true : null, 'pag_false': (this.pag_false !== 1) ? this.pag_false : null}
  }
}
