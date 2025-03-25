import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: false,
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  firstname: any = '' ;
  lastname: any = '' ;
  email: any = '' ;
  password: any = '' ;

  constructor(private authService: AuthService, private router: Router) { }

  onRegister() {
    if (this.firstname && this.lastname && this.email && this.password) {
      const userData = {
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email,
        password: this.password
      };

      this.authService.register(userData).subscribe(
        (response) => {
          console.log('Utilisateur inscrit avec succès:', response);
          this.router.navigate(['/login']).then(() => {
            console.log('Navigation vers la page de connexion réussie');
          }).catch(error => {
            console.log('Échec de la navigation vers la page de connexion:', error);
          });
        },
        (error) => {
          console.log('Erreur lors de l\'inscription de l\'utilisateur:', error);
        }
      );
    } else {
      console.log('Tous les champs sont obligatoires!');
    }
  }
}

