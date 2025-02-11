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
          console.log('User registered successfully:', response);
          this.router.navigate(['/login']).then(() => {
            console.log('Navigation to login successfully');
          }).catch(error => {
            console.log('Navigation to login page failed:', error);
          });
        },
        (error) => {
          console.log('Error registering user:', error);
        }
      );
    } else {
      console.log('All fields are required!');
    }
  }
}

