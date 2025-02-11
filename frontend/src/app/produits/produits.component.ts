import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import {Router, RouterLink} from '@angular/router';

interface Produit {
  id: number;
  nom: string;
  user: {
    firstName: string;
    lastName: string;
  };
  date_creation: string;
  user_id: number;
}

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css'],

  standalone: false
})
export class ProduitsComponent implements OnInit {
  produits: any[] = [];
  nom: string = '';
  produitToEdit: any = null;
  submitted: boolean = false;
  errorMessage : string ='';
  page: number = 1;
  itemsPerPage : number = 6;
  paginateProduits : number[] = [];

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getProduits();
  }

  getProduits(): void {
    this.apiService.getProduits().subscribe(
      (response: any) => {
        this.produits = response.map((produit: any) => {
          produit.user = produit.user || { firstName: '', lastName: '' };
          return produit;
        });
        this.paginateProduits = Array.from({ length: Math.ceil(this.produits.length / this.itemsPerPage) }, (_, i) => i + 1);
      },
      (error: any) => {
        console.error('Error fetching produits:', error);
      }
    );
  }


  addProduit(): void {
    this.submitted = true;

    if (!this.nom){
      this.errorMessage = 'remplir le champ';
      return;
    }
    this.nom = this.nom.charAt(0).toUpperCase() + this.nom.slice(1);
    const userId = this.authService.getToken();

    if (!userId) {
      console.error('User not logged in');
      this.authService.handleUnauthorized();
      return;
    }

    const newProduit = {
      nom: this.nom,
      date_creation: new Date(),
      user_id: userId
    };

    this.apiService.addProduit(newProduit).subscribe(
      (response: any) => {
        console.log('Product added successfully:', response);
        this.getProduits();
        this.resetForm();
      },
      (error: any) => this.handleApiError(error)
    );
  }


  editProduit(produit: any): void {
    this.produitToEdit = { ...produit };
    this.nom = produit.nom;
  }


  updateProduit(): void {
    this.submitted = true;

    if (!this.produitToEdit || !this.nom) {
      this.errorMessage = 'Le nom du produit est obligatoire';
      return;
    }
    this.nom = this.nom.charAt(0).toUpperCase() + this.nom.slice(1);

    const updatedProduit = { ...this.produitToEdit, nom: this.nom };

    this.apiService.updateProduit(updatedProduit).subscribe(
      () => {
        console.log('Product updated successfully');
        this.getProduits();
        this.resetForm();
      },
      (error) => console.error('Error updating produit:', error)
    );
  }


  deleteProduit(id: number): void {
    this.apiService.deleteProduit(id).subscribe(
      () => {
        this.produits = this.produits.filter(p => p.id !== id);
      },
      (error: any) => {
        console.error('Error deleting produit:', error);
      }
    );
  }

  setPageProduits(pageNum: number): void {
    this.page = pageNum;
  }

  changePageProduits(direction: string): void {
    if (direction === 'previous' && this.page > 1) {
      this.page--;
    } else if (direction === 'next' && this.page < this.paginateProduits.length) {
      this.page++;
    }
  }

  handleApiError(error: any): void {
    if (error.status === 401) {
      this.authService.handleUnauthorized();
    } else if (error.status === 400 && error.error.error ==='Product already exists' ) {
      this.errorMessage = 'Le produit existe déjà. Veuillez choisir un autre nom.';
    } else {
      console.error('API Error:', error);
      this.errorMessage = 'Une erreur inattendue est survenue. Veuillez réessayer plus tard.';
    }
  }

  resetForm(): void {
    this.submitted = false;
    this.produitToEdit = null;
    this.nom = '';
    this.errorMessage = '';

  }
}
