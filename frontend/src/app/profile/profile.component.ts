import { Component ,OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user :any ={firstname:'' , lastname: '' , email:'' ,password:''};
  apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.user = this.authService.getUser();
  }

  updateProfile() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json'
    })
    this.http.put(`${this.apiUrl}/auth/profile`, this.user, {headers})
      .subscribe(response => {
        alert("Profile updated successfully!");
        localStorage.setItem('user', JSON.stringify(this.user));
        this.router.navigate(['/home']);
      }, error => {
        alert("Failed to update profile");
      });
  }

}
