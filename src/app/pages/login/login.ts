import { Component } from '@angular/core';
import { FormLogin } from '../../components/form-login/form-login';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormLogin, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {}
