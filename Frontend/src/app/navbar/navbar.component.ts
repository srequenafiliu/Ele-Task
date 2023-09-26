import { Component, OnInit } from '@angular/core';
import { IsActiveMatchOptions, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IUsuario } from '../interfaces/i-usuario';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user:IUsuario|null = null;
  search = "";
  routerLinkActiveOptions: IsActiveMatchOptions = {
    matrixParams: 'ignored',
    queryParams: 'ignored',
    fragment: 'ignored',
    paths: 'exact'
  };

  subscription?: Subscription;
  constructor(/*private usersService:UsersService, protected authService:AuthService,*/ private router:Router) {
    //this.subscription = authService.getData().subscribe(u=>this.user = u)
  }

  ngOnInit(): void {
    //if (this.authService.getToken()) this.usersService.getUser().subscribe(u => this.user = u)
  }

  searchTask() {
    this.router.navigate(["/recetas"], {queryParams: {nombre: this.search}});
    this.search = "";
  }

}
