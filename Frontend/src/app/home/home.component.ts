import { Component } from '@angular/core';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  servicios:{icon:string, titulo:string, texto:string}[] = [
    {icon:'users', titulo:'Crea una cuenta...', texto: 'Registrarse en Ele-Task es muy sencillo, solo te pediremos tu nombre y tu email (no enviamos spam). Ninguno de estos datos será visible al resto de usuarios, solo podrán ver tu nombre de usuario y tu foto de perfil. Podrás acceder cuando quieras con tu correo y tu contraseña.'},
    {icon:'list', titulo:'...guarda tus tareas...', texto: 'Solo escribe la descripción de la tarea y... ¡Listo! La tarea quedará vinculada a tu cuenta para que no te olvides de realizarla. También puedes guardar el día en el que quieres realizarla para ordenar tus tareas.'},
    {icon:'check', titulo:'...y márcalas como realizadas', texto: '¿Ya completaste una de tus tareas? Puedes marcarla como realizada e incluso borrarla de tu lista. Si le pusiste tiempo a tu tarea y no la completaste antes de esa fecha, solo podrás borrarla, así que revisa tu lista con frecuencia.'}
  ];
}
