import { Component } from '@angular/core';
import { IUsuario } from '../interfaces/i-usuario';

@Component({
  selector: 'register-login',
  templateUrl: './register-login.component.html',
  styleUrls: ['./register-login.component.css']
})
export class RegisterLoginComponent {
  newPassword = '';
  newUser = this.initUser();
  errores:string[] = [];
  usuarioExistente = false;
  correoExistente = false;

  //constructor(private usersService:UsersService, private authService:AuthService) {}

  initUser(): IUsuario {
    return {
      id: 0,
      nombre: '',
      email: '',
      usuario:'',
      password: '',
      imagen: null,
      tareas: []
    };
  }

  changeImage(fileInput:HTMLInputElement) {
    if (!fileInput.files || fileInput.files.length === 0) this.newUser.imagen = null;
    else {
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(fileInput.files[0]);
      reader.addEventListener('loadend', () => this.newUser.imagen = reader.result as string);
    }
  }

  addUser(newUser:IUsuario) {
    /*this.authService.addUser(newUser).subscribe({
      next:()=>{
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.authService.login({usuario: newUser.usuario, password: newUser.password!
        }).subscribe(token=>{
          this.authService.setToken(token);
          this.usersService.getUser().subscribe(u=>this.authService.setData(u))
        })
      },
      error:e=>{
        console.log(e.error.error);
        this.errores = (e.error.errores != undefined) ? e.error.errores : [];
        this.usuarioExistente = (e.error.error != undefined) ? e.error.error.includes("(usuario)") : false;
        this.correoExistente = (e.error.error != undefined) ? e.error.error.includes("(correo)") : false;
      }
    });*/
  }

  buscarErrores(name:string):number {
    for (const i in this.errores) if (this.errores[i].includes(name)) return +i;
    return -1;
  }

  reset(fileImage:HTMLInputElement){
    this.newUser = this.initUser();
    this.errores = [];
    this.usuarioExistente = false;
    this.correoExistente = false;
    this.newPassword = '';
    fileImage.value = '';
  }
  /*userLogin:ILogin = {
    usuario: '',
    password: ''
  }*/

  //constructor(private usersService:UsersService, private authService:AuthService) {}

  login() {
    /*this.authService.login(this.userLogin).subscribe({
      next:token=>{
        this.authService.setToken(token);
        this.usersService.getUser().subscribe(u=>this.authService.setData(u));
      },
      error:e=>this.authService.addAlert("alertLogin", false, e.error.error, true)
    })*/
  }
}
