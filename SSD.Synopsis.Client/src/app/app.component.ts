import {Component, inject} from '@angular/core';
import {CanActivateFn, RouterOutlet} from '@angular/router';
import {ChatComponent} from "./chat/chat.component";
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from "./auth/register/register.component";
import {AuthService} from "./auth/auth.service";
import {map} from "rxjs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatComponent, LoginComponent, RegisterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SSD.Synopsis.Client';
}

export const authGuard: CanActivateFn = (route, state) => {
   return inject(AuthService).authenticated().pipe(
      map((auth) => {
          return auth;
        }
      )
   );
};
