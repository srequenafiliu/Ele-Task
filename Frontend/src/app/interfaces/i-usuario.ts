import { ITarea } from "./i-tarea";

export interface IUsuario {
  id:number,
  nombre:string,
  email:string,
  usuario:string,
  password:string,
  imagen:string|null,
  tareas:ITarea[]
}
