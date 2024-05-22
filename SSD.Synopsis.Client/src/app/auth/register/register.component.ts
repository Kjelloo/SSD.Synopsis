import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Router, RouterLink} from "@angular/router";
import {SecurityService} from "../../shared/security.service";
import {AuthUserDto} from "../../shared/dtos/authuser.dto";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private securityService: SecurityService) {
    this.registerForm = new FormGroup({
      username: new FormControl(
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ),
      password: new FormControl(
        '', [
          Validators.required,
          Validators.minLength(8)
        ]
      ),
    });
  }

  register() {
    if (this.registerForm.valid) {
      let userLogin = this.registerForm.value as AuthUserDto;

      localStorage.clear();
      userLogin.password = window.btoa(userLogin.password);
      let userRegister = this.securityService.createUser(userLogin);

      userRegister.then((user) => {
        console.log(user.password);
        this.authService.register(user).subscribe({
          next: async (user) => {
            await this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error('Could not register');
          }
        });
      });
    }
  }

  get username() {
    return this.registerForm.get('username')
  }

  get password() {
    return this.registerForm.get('password')
  }
}
