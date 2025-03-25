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
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;


  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    const credentials = {
      email: this.email,
      password: this.password
    };
    this.isLoading = true;

    this.authService.login(credentials).subscribe(
      (response: any) => {
        console.log('Connexion réussie:', response);
        localStorage.setItem('token', response.token);
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Erreur lors de la connexion:', error);
        this.errorMessage = 'Identifiant ou mot de passe incorrect, veuillez réessayer.';
        this.isLoading = false;
      }
    );
  }
}
