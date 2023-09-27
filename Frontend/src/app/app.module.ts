import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { UserListComponent } from './user-list/user-list.component';
import { RegisterLoginComponent } from './register-login/register-login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BaseUrlInterceptor } from './interceptors/base-url.interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserInfoComponent } from './user-info/user-info.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskItemComponent } from './task-item/task-item.component';
import { TaskAddComponent } from './task-add/task-add.component';

import localeEs from '@angular/common/locales/es';
import {registerLocaleData} from '@angular/common';
registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    UserListComponent,
    RegisterLoginComponent,
    UserInfoComponent,
    TaskListComponent,
    TaskItemComponent,
    TaskAddComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseUrlInterceptor,
      multi: true,
    },
    {
      provide : HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi   : true,
    },
    {provide: LOCALE_ID, useValue: "es"}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
