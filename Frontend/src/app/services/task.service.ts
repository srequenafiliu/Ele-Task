import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ITarea } from '../interfaces/i-tarea';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private taskURL="tareas";
  constructor(private http:HttpClient) { }

  getTasksUser(pag:number, size:number, realizada:number):Observable<{count:number, result:ITarea[]}> {
    let params:HttpParams = new HttpParams().set("pag", pag).set("size", size);
    params = (realizada != -1) ? params.set("realizada", realizada) : params;
    return this.http.get<{count:number, result:ITarea[]}>(`${this.taskURL}/usuario`, {params}).pipe(
      catchError((resp: HttpErrorResponse) => throwError( () => 'Error '+resp.status+': '+resp.statusText))
    );
  }

  getTask = (idTarea:number):Observable<ITarea> => this.http.get<ITarea>(`${this.taskURL}/${idTarea}`).pipe(response=>response);

  addTask = (newTask:ITarea):Observable<ITarea> => this.http.post<{tarea:ITarea, error?:string}>(this.taskURL, newTask).pipe(map(response => response.tarea));

  updateRepice = (repice:ITarea):Observable<ITarea> => this.http.put<{receta:ITarea, mensaje:string, error?:string}>(`${this.taskURL}/${repice.id}`, repice).pipe(map(response=>response.receta))

  followRepice = (idReceta:number):Observable<String> => this.http.put<{mensaje:string}>(`${this.taskURL}/${idReceta}/seguimiento`, null).pipe(map(response=>response.mensaje))

  deleteRepice = (idReceta:number):Observable<string> => this.http.delete<{mensaje:string}>(`${this.taskURL}/${idReceta}`).pipe(map(response =>response.mensaje));
}
