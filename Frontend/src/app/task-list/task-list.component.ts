import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ITarea } from '../interfaces/i-tarea';

@Component({
  selector: 'task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  pag!:number;
  innerWidth = window.innerWidth;
  size = (this.innerWidth>540) ? 4 : 2;
  sortField!:string;
  sortDir!:string;
  nombre!:string;
  tipo!:string;
  necesidades!:string;
  dificultad!:number;
  url = window.location.pathname;
  // id_usuario = this.url.includes('/perfil-usuario') && this.authService.getToken() != null ? jwtDecode<{id:number}>(<string>this.authService.getToken()).id : 0;
  usuario!:string;
  count!:number;
  repices!:ITarea[];
  pages!:(string|number)[];
  needs:{value:string, title:string, checked:boolean}[] = [
    {value:'g', title:'Sin gluten', checked:false},
    {value:'l', title:'Sin lactosa', checked:false},
    {value:'v', title:'Vegana', checked:false}
  ];

  constructor(/*private repicesService:RepicesService,*/ private authService:AuthService,
    private userService:UserService, private route:ActivatedRoute, private router:Router) {
    this.route.queryParams.subscribe(params => {
      this.pag = (+params["pag"]) ? +params["pag"] : 1;
      this.sortField = (params["sortField"]) ? params["sortField"] : 'id';
      this.sortDir = (params["sortDir"]) ? params["sortDir"] : 'asc';
      this.nombre = (params["nombre"]) ? params["nombre"] : '';
      this.tipo = (params["tipo"]) ? params["tipo"] : '';
      this.necesidades = (params["necesidades"]) ? params["necesidades"] : '';
      for (const n of this.needs) n.checked = this.necesidades.includes(n.value);
      this.dificultad = (+params["dificultad"]) ? +params["dificultad"] : 0;
      this.getRecetas();
    })
  }

  ngOnInit(): void {
    if (this.authService.getToken()) this.userService.getUser().subscribe(u=>this.usuario = u.usuario)
  }

  getRecetas() {
    this.pag = (this.pag-1)*this.size>=this.count ? Math.ceil(this.count/this.size) : this.pag;
    /*this.repicesService.getRepices(this.pag, this.size, this.sortField, this.sortDir, this.nombre, this.tipo, this.necesidades, this.dificultad, this.id_usuario).subscribe({
      next: r=>{
        this.count = r.count;
        this.repices=r.result;
        const length = Math.ceil(r.count/this.size);
        this.pages = (length>7) ? this.getPages(this.pag, length) : Array(length).fill(1).map((_x, i)=>i+1);
      },
      error: e=>document.getElementById("server_error_r")?.appendChild(document.createTextNode(e)),
    });*/
  }

  getPages(pagActual:number, length:number) {
    switch (pagActual) {
      case 1: case 2: case length-1: case length: return [1, 2, 3, '...', length-2, length-1, length];
      case 3: return [1, 2, 3, 4, '...', length-1, length];
      case length-2: return [1, 2, "...", length-3, length-2, length-1, length];
      default: return [1, (pagActual == 4) ? 2 : '...', pagActual-1, pagActual, pagActual+1, (pagActual == length-3) ? length-1 : '...', length];
    }
  }

  getQueryParams(pagNum:number, sortF:string, sortD:string, nombre:string, tipo:string, necesidades:string, dificultad:number) {
    return {'pag': (pagNum !== 1) ? pagNum : null, 'sortField': (sortF !== 'id') ? sortF : null,
    'sortDir': (sortF !== 'id') ? sortD : null, 'nombre': (nombre !== '') ? nombre : null,
    'tipo': (tipo !== '') ? tipo : null, 'necesidades': (necesidades !== '') ? necesidades : null,
    'dificultad': (dificultad !== 0) ? dificultad : null}
  }

  filter = (nombre:string, tipo:string, necesidades:string, dificultad:number) => this.router.navigate([this.url], {queryParams: this.getQueryParams(1, this.sortField, this.sortDir, nombre, tipo, necesidades, dificultad)});

  getNecesidades() {
    this.necesidades = "";
    for (const n of this.needs) this.necesidades += (n.checked) ? n.value : "";
    this.filter(this.nombre, this.tipo, this.necesidades, this.dificultad);
  }

  borrarReceta() {
    //if (this.pag != 1 && this.repices.length == 1) this.filter(this.nombre, this.tipo, this.necesidades, this.dificultad);
    this.getRecetas();
  }
}
