import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ITarea } from '../interfaces/i-tarea';

@Component({
  selector: 'user-password',
  templateUrl: './user-password.component.html',
  styleUrls: ['./user-password.component.css']
})
export class UserPasswordComponent {
  userPass = this.initUserPass();
  new_pass = '';
  tarea:ITarea = {
    descripcion:"Recuerda que la contraseña debe tener al menos 8 caracteres, entre ellos mínimo "+
    "una letra mayúscula, una letra minúscula y un número",
    realizada:false
  }
  errores = this.cleanErrores();

  constructor(private authService:AuthService) {}

  initUserPass() {
    return {
      password: '',
      new_password: ''
    };
  }

  changePassword() {
    if (this.new_pass != this.userPass.new_password){
      this.cleanErrores();
      this.errores.new_password.push("Las contraseñas no coinciden")
    }
    else {
      this.authService.changePassword(this.userPass).subscribe({
        next:()=>{
          this.reset();
          this.authService.addAlert("alertPass", true, "Contraseña cambiada correctamente", false);
        },
        error:e=>this.errores = (e.error.messages != undefined) ? e.error.messages : this.cleanErrores()
      });
    }
  }

  cleanErrores():{password:string[], new_password:string[]} {
    return {
      password: [],
      new_password: []
    };
  }


  reset() {
    this.userPass = this.initUserPass();
    this.new_pass = '';
    this.cleanErrores()
  }
}
