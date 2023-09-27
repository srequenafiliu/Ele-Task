import { Component } from '@angular/core';
import { IUsuario } from '../interfaces/i-usuario';
import { ILogin } from '../interfaces/i-login';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'register-login',
  templateUrl: './register-login.component.html',
  styleUrls: ['./register-login.component.css']
})
export class RegisterLoginComponent {
  opcion = 'register';
  newPassword = '';
  newUser = this.initUser();
  errores = this.cleanErrores();
  userLogin:ILogin = {
    email: '',
    password: ''
  }

  constructor(private userService:UserService, private authService:AuthService) {}

  initUser(): IUsuario {
    return {
      nombre: '',
      email: '',
      usuario:'',
      password: '',
      imagen: null
    };
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
    if (!fileInput.files || fileInput.files.length === 0) this.newUser.imagen = null;
    else {
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(fileInput.files[0]);
      reader.addEventListener('loadend', () => this.newUser.imagen = reader.result as string);
    }
  }

  addUser() {
    this.authService.addUser(this.newUser).subscribe({
      next:()=>{
        this.authService.login({email: this.newUser.email, password: this.newUser.password}).subscribe(token=>{
          this.authService.setToken(token);
          this.userService.getUser().subscribe(u=>this.authService.setData(u))
        })
      },
      error:e=>this.errores = (e.error.messages != undefined) ? e.error.messages : this.cleanErrores()
    });
  }

  reset(fileImage:HTMLInputElement){
    this.newUser = this.initUser();
    this.errores = this.cleanErrores();
    this.newPassword = '';
    fileImage.value = '';
  }

  login() {
    this.authService.login(this.userLogin).subscribe({
      next:token=>{
        this.authService.setToken(token);
        this.userService.getUser().subscribe(u=>this.authService.setData(u));
      },
      error:e=>this.authService.addAlert("alertLogin", false, e.error.error, true)
    })
  }
}
