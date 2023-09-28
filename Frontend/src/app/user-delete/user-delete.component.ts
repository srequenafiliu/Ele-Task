import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.css']
})
export class UserDeleteComponent {
  constructor(private userService: UserService, private authService:AuthService) {}

  deleteUsuario = () => this.userService.deleteUser().subscribe(()=>this.authService.logout(false))
}
