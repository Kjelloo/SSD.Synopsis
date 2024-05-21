import { Routes } from '@angular/router';
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from "./auth/register/register.component";
import {ChatComponent} from "./chat/chat.component";
import {authGuard} from "./app.component";

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'chat', component: ChatComponent, canActivate: [authGuard]},
  {path: '**', redirectTo: 'login', pathMatch: 'full'},
];
