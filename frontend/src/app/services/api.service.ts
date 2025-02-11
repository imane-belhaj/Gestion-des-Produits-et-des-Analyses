import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}


  private getAuthToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  }


  private getAuthHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }
//Produits

  getAllProduitsForHome(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/produits/home` ,{headers});
  }
  getProduits(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/produits `, { headers });
  }


  addProduit(produit: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/produits`, produit, { headers });
  }

  updateProduit(produit: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/produits/${produit.id}`, produit, { headers });
  }

  deleteProduit(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/produits/${id}`, { headers });
  }

  //Analyses
  getAllAnalysesForHome(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/analyses/home`, { headers });
  }

  getAnalyses(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/analyses`, { headers });
  }

  addAnalyse(analysis: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/analyses`, analysis, { headers });
  }

  updateAnalyse(analysis: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/analyses/${analysis.id}`, analysis, { headers });
  }

  deleteAnalyse(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/analyses/${id}`, { headers });
  }

}
