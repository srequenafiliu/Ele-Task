import { IUsuario } from "./i-usuario";

export interface ITarea {
  id?:number,
  descripcion:string,
  realizada:boolean,
  fecha?:Date,
  usuario?:IUsuario
}
