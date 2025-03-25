import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface LoginResponse {
  token: string;
  user:{
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router) { }

  // Login method that saves the token to localStorage
  login(userData: any): Observable<LoginResponse & {user : any}> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, userData)
      .pipe(
        tap(response => {

          if (response && response.token) {
            localStorage.setItem('token', response.token); // Save token to localStorage
            localStorage.setItem('user', JSON.stringify(response.user));
          }
        })
      );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }


  getToken() {
    return localStorage.getItem('token');
  }
  getUser() {
    const user = localStorage.getItem('user');
    return user? JSON.parse(user) : null;
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['login']);
  }
  handleUnauthorized(): void {
    console.error('Unauthorized access detected ,Redirecting to login');
    this.logout();
  }
  isLoggedIn() {
    return !!localStorage.getItem('token');
  }
}
