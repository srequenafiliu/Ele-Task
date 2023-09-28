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

  getTasks():Observable<ITarea[]> {
    return this.http.get<ITarea[]>(this.taskURL).pipe(
      catchError((resp: HttpErrorResponse) => throwError( () => 'Error '+resp.status+': '+resp.statusText))
    );
  }

  getTask = (idTarea:number):Observable<ITarea> => this.http.get<ITarea>(`${this.taskURL}/${idTarea}`).pipe(response=>response);

  getTasksUser(pag:number, size:number, realizada:number):Observable<{count:number, result:ITarea[]}> {
    let params:HttpParams = new HttpParams().set("pag", pag).set("size", size);
    params = (realizada != -1) ? params.set("realizada", realizada) : params;
    return this.http.get<{count:number, result:ITarea[]}>(`${this.taskURL}/usuario`, {params}).pipe(
      catchError((resp: HttpErrorResponse) => throwError( () => 'Error '+resp.status+': '+resp.statusText))
    );
  }

  addTask = (newTask:ITarea):Observable<ITarea> => this.http.post<{tarea:ITarea, error?:string}>(this.taskURL, newTask).pipe(map(response => response.tarea));

  updateTask = (task:ITarea):Observable<ITarea> => this.http.put<{tarea:ITarea, error?:string}>(`${this.taskURL}/${task.id}`, task).pipe(map(response=>response.tarea))

  deleteTask = (idTarea:number) => this.http.delete(`${this.taskURL}/${idTarea}`);
}
