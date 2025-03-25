import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

interface Produit {
  id: number;
  nom: string;
  created_by: string;
  date_creation: string;
  date_modification: string;
}

interface Analyse {
  id: number;
  nom_analyse: string;
  created_by: string;
  valeur_max: number;
  valeur_min: number;
  date_creation: string;
  date_modification: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false
})
export class HomeComponent implements OnInit {
  produits: Produit[] = [];
  analyses: Analyse[] = [];
  isLoadingProduits = true;
  isLoadingAnalyses = true;
  pageProduits: number = 1;
  pageAnalyses: number = 1;
  paginateProduits: number[] = [];
  paginateAnalyses: number[] = [];

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchProduits();
    this.fetchAnalyses();
  }

  fetchProduits(): void {
    this.apiService.getAllProduitsForHome().subscribe(
      (data) => {
        this.produits = data;
        this.isLoadingProduits = false;
        this.calculatePages(this.produits.length, 'produits',5);
      },
      (error) => {
        console.error('Error fetching produits', error);
        this.isLoadingProduits = false;
      }
    );
  }

  fetchAnalyses(): void {
    this.apiService.getAllAnalysesForHome().subscribe(
      (data: any[]) => {
        this.analyses = data;
        this.isLoadingAnalyses = false;
        this.calculatePages(this.analyses.length, 'analyses',5);
      },
      (error) => {
        console.error('Error fetching analyses', error);
        this.isLoadingAnalyses = false;
      }
    );
  }

  calculatePages(itemCount: number, type: string, itemsPerPage: number): void {
    const totalPages = Math.ceil(itemCount / itemsPerPage);

    if (type === 'produits') {
      this.paginateProduits = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (type === 'analyses') {
      this.paginateAnalyses = Array.from({ length: totalPages }, (_, i) => i + 1);
    }
  }

  // Method to change page when clicking the 'previous' or 'next' buttons
  changePageProduits(direction: string): void {
    if (direction === 'previous' && this.pageProduits > 1) {
      this.pageProduits--;
    } else if (direction === 'next' && this.pageProduits < this.paginateProduits.length) {
      this.pageProduits++;
    }
  }
  changePageAnalyses(direction: string): void {
    if (direction === 'previous' && this.pageAnalyses > 1) {
      this.pageAnalyses--;
    } else if (direction === 'next' && this.pageAnalyses < this.paginateAnalyses.length) {
      this.pageAnalyses++;
    }
  }

  setPageProduits(page: number): void {
    this.pageProduits = page;
  }
  // Method to set page directly when clicking on a page number
  setPageAnalyses(page: number): void {
    this.pageAnalyses = page;
  }

}
