import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Router, RouterLink} from "@angular/router";
import {SecurityService} from "../../shared/security.service";
import {AuthUserDto} from "../../shared/dtos/authuser.dto";
import {db} from "../../chat/db/db";

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

  async register() {
    if (this.registerForm.valid) {
      let userLogin = this.registerForm.value as AuthUserDto;

      userLogin.password = window.btoa(userLogin.password);
      let userRegister = this.securityService.createUser(userLogin);

      userRegister.then(async (user) => {
        let keyPair = await this.securityService.generateKeyPair();

        let publicKey = await crypto.subtle.exportKey("raw", keyPair.publicKey);
        // export private key to JSON Web Key. Private keys can only be exported as JWK
        let privateKey = await crypto.subtle.exportKey("jwk", keyPair.privateKey);

        user.publicKey = this.securityService.arrayBufferToBase64(publicKey);

        this.authService.register(user).subscribe({
          next: async (user) => {
            user.privateKey = JSON.stringify(privateKey, null, 2);

            // save user to local database
            db.users.add(user);

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
