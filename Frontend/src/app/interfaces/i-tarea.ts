import { IUsuario } from "./i-usuario";

export interface ITarea {
  id:number,
  descripcion:string,
  realizada:boolean,
  id_usuario:number,
  usuario:IUsuario
}
