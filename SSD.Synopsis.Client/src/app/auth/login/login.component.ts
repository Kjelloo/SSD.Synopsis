import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {SecurityService} from "../../shared/security.service";
import {AuthService} from "../auth.service";
import {AuthUserDto} from "../../shared/dtos/authuser.dto";
import {environment} from "../../../environments/environment";
import {db} from "../../chat/db/db";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private securityService: SecurityService) {
    this.loginForm = new FormGroup({
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

  ngOnInit(): void {

  }

  async login() {
    if (this.loginForm.valid) {

      localStorage.clear();
      let userLogin = this.loginForm.value as AuthUserDto;
      userLogin.password = window.btoa(userLogin.password);

      // Get salt from server for a given username
      this.authService.getSalt(userLogin.username).subscribe({
        next: async (salt) => {
          // Create key from password and salt
          let saltArray = this.securityService.base64ToArrayBuffer(salt);

          let key = await this.securityService.deriveKey(userLogin.password, saltArray, environment.passwordIter)

          let exportedKey = await crypto.subtle.exportKey("raw", key)

          userLogin.password = this.securityService.arrayBufferToBase64(exportedKey);

          this.authService.login(userLogin).subscribe({
            next: async (user) => {
              if (user && user.token != undefined && user.token.length > 0) {
                localStorage.setItem('user', JSON.stringify(user));

                if (await db.users.where("guid").equalsIgnoreCase(user.guid!).count() == 0) {
                  db.users.add(user);
                }

                this.router.navigate(['chat']);
              }
            },
            error: (error) => {
              console.error('Could not login');
            }
          });

        },
        error: (error) => {
          console.error('Could not get salt');
        }
      });
    }
  }

  get username() {
    return this.loginForm.get('username')
  }

  get password() {
    return this.loginForm.get('password')
  }
}
