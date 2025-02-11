import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: false,
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: any = '';
  password: any = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    const credentials = {
      email: this.email,
      password: this.password
    };

    this.authService.login(credentials).subscribe(
      (response: any) => {
        console.log('Login successful:', response);
        localStorage.setItem('token :', response.token);
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Error during login:', error);
      }
    );
  }
}
