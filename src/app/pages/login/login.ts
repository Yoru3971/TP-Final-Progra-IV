import { Component } from '@angular/core';
import { FormLogin } from '../../components/forms/form-login/form-login';
import { RouterLink } from '@angular/router';
import { GoogleLoginButton } from '../../components/utils/google-login-button/google-login-button';

@Component({
  selector: 'app-login',
  imports: [FormLogin, GoogleLoginButton, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {}
