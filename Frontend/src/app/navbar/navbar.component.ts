import { Component, OnInit } from '@angular/core';
import { IsActiveMatchOptions, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IUsuario } from '../interfaces/i-usuario';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

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
  constructor(private userService:UserService, protected authService:AuthService, private router:Router) {
    this.subscription = authService.getData().subscribe(u=>this.user = u)
  }

  ngOnInit(): void {
    if (this.authService.getToken()) this.userService.getUser().subscribe(u => this.user = u)
  }

  searchTask() {
    this.router.navigate(["/recetas"], {queryParams: {nombre: this.search}});
    this.search = "";
  }

}
