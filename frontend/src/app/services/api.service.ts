import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  addAnalyse(newAnalyse: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/analyses`, newAnalyse, { headers });
  }

  updateAnalyse(analysis: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/analyses/${analysis.id}`, analysis, { headers });
  }

  deleteAnalyse(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/analyses/${id}`, { headers });
  }

  //Plan-controle

  getPlansControle(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/plans`, {headers})
  }
  getAllPlansControle(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/plans/all`, { headers });
  }

  addPlanControle(plan: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/plans`, plan, { headers });
  }

  updatePlanControle(id:number ,plan:any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/plans/${id}`,plan, { headers });
  }

  deletePlanControle(id:number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/plans/${id}`, { headers });
  }

  //Ligne-controle

  getAllLignesControle(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/lignes/all`, { headers });
  }
  getLignesControle():Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/lignes`, { headers });
  }
  addLigneControle(data:any):Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/lignes`, data, { headers });
  }
  updateLigneControle(id:number, data:any):Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/lignes/${id}`, data, { headers });
  }
  deleteLigneControle(id:number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/lignes/${id}`, { headers });
  }

  //Units

  addUnit(unit:any):Observable<any>{
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/units`, unit ,{ headers });
  }
  getAllUnits(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/units`, { headers });
  }

}
