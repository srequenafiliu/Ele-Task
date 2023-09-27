import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ITarea } from '../interfaces/i-tarea';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private taskURL="tareas";
  constructor(private http:HttpClient) { }

  /*getRepices(pag:number, size:number, sortField:string, sortDir:string, nombre:string, tipo:string, necesidades:string, dificultad:number, id_usuario:number):Observable<{count:number, result:IRepiceDto[]}> {
    let params:HttpParams = new HttpParams().set("pag", pag).set("size", size).set("sortField", sortField)
    .set("sortDir", sortDir).set("nombre", nombre).set("tipo", tipo).set("necesidades", necesidades);
    params = (dificultad != 0) ? params.set("dificultad", dificultad) : params;
    params = (id_usuario != 0) ? params.set("id_usuario", id_usuario) : params;
    return this.http.get<{count:number, result:IRepiceDto[]}>(this.taskURL, {params}).pipe(
      catchError((resp: HttpErrorResponse) => throwError( () => 'Error '+resp.status+': '+resp.statusText))
    );
  }*/

  getRepice = (idReceta:number):Observable<ITarea> => this.http.get<ITarea>(`${this.taskURL}/${idReceta}`).pipe(response=>response);

  addTask = (newTask:ITarea):Observable<ITarea> => this.http.post<{tarea:ITarea, error?:string}>(this.taskURL, newTask).pipe(map(response => response.tarea));

  updateRepice = (repice:ITarea):Observable<ITarea> => this.http.put<{receta:ITarea, mensaje:string, error?:string}>(`${this.taskURL}/${repice.id}`, repice).pipe(map(response=>response.receta))

  followRepice = (idReceta:number):Observable<String> => this.http.put<{mensaje:string}>(`${this.taskURL}/${idReceta}/seguimiento`, null).pipe(map(response=>response.mensaje))

  deleteRepice = (idReceta:number):Observable<string> => this.http.delete<{mensaje:string}>(`${this.taskURL}/${idReceta}`).pipe(map(response =>response.mensaje));
}
