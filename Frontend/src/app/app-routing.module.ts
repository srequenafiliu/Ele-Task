import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserListComponent } from './user-list/user-list.component';
import { noUserGuard } from './guards/no-user.guard';
import { RegisterLoginComponent } from './register-login/register-login.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { userGuard } from './guards/user.guard';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskAddComponent } from './task-add/task-add.component';
import { TaskUpdateComponent } from './task-update/task-update.component';
import { UserUpdateComponent } from './user-update/user-update.component';

const routes: Routes = [
  { path: 'inicio', component: HomeComponent, title: "Ele-Task" },
  { path: 'usuarios', component: UserListComponent, title: "Ele-Task | Usuarios" },
  //{ path: 'necesidades-especiales', component: NeedsComponent, title: "SweetStoves | Necesidades especiales" },
  { path: 'login', component: RegisterLoginComponent, title: "Ele-Task | Inicio de sesión", canActivate: [noUserGuard] },
  { path: 'perfil-usuario', component: UserInfoComponent, title: "Ele-Task | Perfil del usuario", canActivate: [userGuard], children: [
    { path: 'tareas', component: TaskListComponent },
    { path: "administrar-tarea", component: TaskUpdateComponent },
    { path: "nueva-tarea", component: TaskAddComponent },
    { path: "actualizar-cuenta", component: UserUpdateComponent },
    /*{ path: "actualizar-password", component: UserPasswordComponent },
    { path: "borrar-cuenta", component: UserDeleteComponent },*/
    { path: '', redirectTo: 'tareas', pathMatch: 'full' },
    { path: '**', redirectTo: 'tareas', pathMatch: 'full' }
  ] },
  { path: '', redirectTo: '/inicio', pathMatch: 'full' }, // Ruta por defecto (vacía)
  { path: '**', redirectTo: '/inicio', pathMatch: 'full' } // Ruta que no coincide con ninguna de las anteriores
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
