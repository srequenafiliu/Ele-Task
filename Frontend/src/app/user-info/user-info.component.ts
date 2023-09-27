import { Component, OnInit } from '@angular/core';
import { IUsuario } from '../interfaces/i-usuario';
import { IsActiveMatchOptions } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  user!:IUsuario;
  tareas_realizadas!:number;
  movil = window.innerWidth<=767;
  opciones:{titulo:string, color:string, link:string, texto:string}[] = [
    {titulo:'Tu lista de tareas', color:'btn-outline-info', link:'tareas', texto:'Consulta y gestiona las tareas que has creado'},
    {titulo:'Nueva tarea', color:'btn-outline-success', link:'nueva-tarea', texto:'Crea una nueva tarea que se vinculará a tu cuenta'},
    {titulo:'Actualiza tu cuenta', color:'btn-outline-warning', link:'actualizar-cuenta', texto:'Actualiza los datos de tu cuenta excepto tu contraseña'},
    {titulo:'Cambia tu contraseña', color:'btn-outline-dark', link:'actualizar-password', texto:'Cambia tu contraseña para hacer tu cuenta más segura'},
    {titulo:'Borra tu cuenta', color:'btn-outline-danger', link:'borrar-cuenta', texto:'Puedes borrar tu cuenta sin compromiso, pero te echaremos de menos'}
  ];
  routerLinkActiveOptions: IsActiveMatchOptions = {
    matrixParams: 'ignored',
    queryParams: 'ignored',
    fragment: 'ignored',
    paths: 'exact'
  };

  subscription: Subscription;
  constructor(private userService:UserService, protected authService:AuthService) {
    this.subscription = authService.getData().subscribe(u => this.user = <IUsuario>u)
  }
  ngOnInit(): void {
    this.userService.getUser().subscribe(u => {
      this.user = u;
      this.tareas_realizadas = u.tareas ? u.tareas?.filter(t =>t.realizada).length : 0
    })
  }
}
