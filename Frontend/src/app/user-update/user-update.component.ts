import { Component, OnInit } from '@angular/core';
import { IUsuario } from '../interfaces/i-usuario';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit {
  user!:IUsuario;
  opcion = 'conservar';
  errores = this.cleanErrores();
  valorImagen:string|null = null
  password = '';

  constructor(private userService:UserService, private authService:AuthService) {}
  ngOnInit(): void {
    this.userService.getUser().subscribe(u => {
      this.user = u;
      this.valorImagen = u.imagen;
    })
  }

  cleanErrores():{email:string[], nombre:string[], password:string[], usuario:string[]} {
    return {
      email: [],
      nombre: [],
      password: [],
      usuario: []
    };
  }

  changeImage(fileInput:HTMLInputElement) {
    if (!fileInput.files || fileInput.files.length === 0) this.user.imagen = null;
    else {
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(fileInput.files[0]);
      reader.addEventListener('loadend', () => this.user.imagen = reader.result as string);
    }
  }

  updateUser(user:IUsuario, fileImage:HTMLInputElement) {
    if (this.opcion == "conservar") user.imagen = this.valorImagen;
    if (this.opcion == 'borrar') user.imagen = null;
    const copia_usuario = Object.assign({}, user);
    copia_usuario.tareas = undefined;
    copia_usuario.password = this.password;
    this.userService.updateUser(copia_usuario).subscribe({
      next:respu=>{
        respu.imagen = copia_usuario.imagen
        this.authService.sendData(respu)
        this.errores = this.cleanErrores();
        fileImage.value = '';
        this.password = '';
        this.authService.addAlert("alertUpdate", true, "Datos actualizados correctamente", false);
      },
      error:e=>this.errores = (e.error.messages != undefined) ? e.error.messages : this.cleanErrores()
    });
  }

  reset(fileImage:HTMLInputElement){
    this.userService.getUser().subscribe(u => {
      this.user = u;
      this.valorImagen = u.imagen;
    })
    this.errores = this.cleanErrores();
    fileImage.value = '';
    this.password = '';
  }
}
