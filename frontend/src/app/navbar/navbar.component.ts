import { Component,OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent {

  user : any = null;

  constructor(private router: Router, private AuthService: AuthService) {}

  ngOnInit() {
    this.user = this.AuthService.getUser();

  }

  logout(): void {
    this.AuthService.logout();
    this.router.navigate(['/login']);
  }


}
