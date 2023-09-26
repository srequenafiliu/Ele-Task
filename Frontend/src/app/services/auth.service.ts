import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, map } from 'rxjs';
import { ILogin } from '../interfaces/i-login';
import { IUsuario } from '../interfaces/i-usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authURL="auth";
  constructor(private http:HttpClient, private router:Router) { }

  login = (userLogin:ILogin):Observable<string> => this.http
  .post<{accessToken:string, error?:string}>(`${this.authURL}/login`, userLogin).pipe(map(response=>response.accessToken));

  /*changePassword = (userPass:IPasswordDto):Observable<string> => this.http
  .put<{mensaje:string, error?:string}>(`${this.authURL}/change_password`, userPass).pipe(map(response=>response.mensaje));*/

  addUser = (newUser:IUsuario):Observable<IUsuario> => this.http
  .post<{usuario:IUsuario, mensaje:string, error?:string}>(`${this.authURL}/registro`, newUser).pipe(map(response => response.usuario));

  private subject = new Subject<IUsuario|null>(); // Pseudo EventEmitter
  sendData = (usuario:IUsuario|null) => this.subject.next(usuario);
  getData = (): Observable<IUsuario|null> => this.subject.asObservable();

  getToken = () => localStorage.getItem('token_eletask') ? localStorage.getItem('token_eletask') : null;
  setToken = (token:string) => localStorage.setItem('token_eletask', token);
  /*expiredToken = (token:string|null) => token && new Date(jwtDecode<{exp:number}>(token).exp*1000) < new Date()
  Si el token tuviese fecha de caducidad, se usaría esta función y, si devolviera true, se debería llamar a logout()*/

  setData(usuario:IUsuario) {
    this.sendData(usuario);
    this.router.navigate(['/perfil-usuario']);
  }

  logout(){
    localStorage.removeItem('token');
    this.sendData(null)
    this.router.navigate(['/inicio'])
  }

  addAlert(id:string, correcto:boolean, texto:string, first:boolean){
    const div = document.getElementById(id);
    const alert = document.createElement("div");
    alert.className = "alert alert-dismissible "+(correcto?"alert-primary":"alert-info")+" fade show";
    const icon = document.createElement("i");
    icon.className = "fa-solid fa-circle-"+((correcto)?"check":"xmark");
    const close = document.createElement("button");
    close.className = "btn-close";
    close.setAttribute("type", "button");
    close.setAttribute("data-bs-dismiss", "alert");
    alert.appendChild(icon);
    alert.appendChild(close);
    alert.appendChild(document.createTextNode(" "+texto));
    div?.insertBefore(alert, (first) ? div.firstChild : div.lastChild);
  }
}
