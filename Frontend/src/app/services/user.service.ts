import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { IUsuario } from '../interfaces/i-usuario';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userURL="usuarios";
  constructor(private http:HttpClient, private authService:AuthService) { }

  getUsers(pag:number, size:number):Observable<{count:number, result:IUsuario[]}> {
    const params:HttpParams = new HttpParams().set("pag", pag).set("size", size);
    return this.http.get<{count:number, result:IUsuario[]}>(this.userURL, {params}).pipe(
      catchError((resp: HttpErrorResponse) => throwError( () => 'Error '+resp.status+': '+resp.statusText))
    );
  }

  getUser = ():Observable<IUsuario> => this.http.get<IUsuario>(`${this.userURL}/logged`).pipe(
    catchError((resp: HttpErrorResponse) => {
      this.authService.logout(true)
      return throwError( () => 'Error '+resp.status+': '+resp.statusText)
    })
  );

  updateUser = (user:IUsuario):Observable<IUsuario> => this.http.put<{usuario:IUsuario, mensaje:string, error?:string}>(`${this.userURL}/logged`, user).pipe(map(response=>response.usuario))

  deleteUser = ():Observable<string> => this.http.delete<{mensaje:string}>(`${this.userURL}/logged`).pipe(map(response =>response.mensaje));
}
