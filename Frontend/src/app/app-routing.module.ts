import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserListComponent } from './user-list/user-list.component';
import { noUserGuard } from './guards/no-user.guard';
import { RegisterLoginComponent } from './register-login/register-login.component';

const routes: Routes = [
  { path: 'inicio', component: HomeComponent, title: "Ele-Task" },
  { path: 'usuarios', component: UserListComponent, title: "Ele-Task | Usuarios" },
  //{ path: 'necesidades-especiales', component: NeedsComponent, title: "SweetStoves | Necesidades especiales" },
  { path: 'login', component: RegisterLoginComponent, title: "Ele-Task | Inicio de sesión", canActivate: [noUserGuard] },
  /*{ path: 'perfil-usuario', component: UserInfoComponent, title: "SweetStoves | Perfil del usuario", canActivate: [userGuard], children: [
    { path: 'recetas', component: RepiceListComponent },
    { path: "nueva-receta", component: RepiceManagementComponent },
    { path: "actualizar-receta", component: RepiceManagementComponent },
    { path: "actualizar-cuenta", component: UserUpdateComponent },
    { path: "actualizar-password", component: UserPasswordComponent },
    { path: "borrar-cuenta", component: UserDeleteComponent },
    { path: '', redirectTo: 'recetas', pathMatch: 'full' },
    { path: '**', redirectTo: 'recetas', pathMatch: 'full' }
  ] },*/
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
