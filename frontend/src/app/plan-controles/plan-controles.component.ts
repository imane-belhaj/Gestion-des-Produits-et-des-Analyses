import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

interface Produit {
  id: number;
  nom: string;
}

interface PlanControle {
  plan_id: number;
  nom: string;
  produit_id: number;
  produit_nom: string;
  created_by:string;
  user_id: number;
  date_creation: string;
}

@Component({
  selector: 'app-plan-controles',
  templateUrl: './plan-controles.component.html',
  styleUrls: ['./plan-controles.component.css'],
  standalone: false
})
export class PlanControlesComponent implements OnInit {
  plansControle: PlanControle[] = [];
  produits: Produit[] = [];
  selectedProduitId: number | null = null;
  planControle: PlanControle | null = null;
  nom: string = '';
  submitted: boolean = false;
  errorMessage: string = '';
  page: number = 1;
  itemsPerPage: number = 6;
  constructor(private apiService: ApiService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadProduits();
    this.loadPlansControle();
  }

  loadProduits(): void {
    this.apiService.getAllProduitsForHome().subscribe(
      (data: Produit[]) => {
        //console.log(data);
        this.produits = data;
      },
      (error) => console.error('Erreur lors du chargement des produits:', error)
    );
  }

  loadPlansControle(): void {
    this.apiService.getAllPlansControle().subscribe(
      (data: PlanControle[]) => {
        this.plansControle = data;
      },
      (error) => console.error('Erreur lors du chargement des plans de contrôle:', error)
    );
  }

  addPlanControle(): void {
    this.submitted = true;

    if (!this.selectedProduitId || !this.nom) {
      this.errorMessage = 'Tous les champs sont obligatoires';
      return;
    }

    const userId = this.authService.getToken();
    if (!userId) {
      console.error('Utilisateur non connecté');
      this.authService.handleUnauthorized();
      return;
    }

    const newPlan = {
      nom: this.nom.charAt(0).toUpperCase() + this.nom.slice(1),
      produit_id: this.selectedProduitId,
      user_id: userId
    };

    this.apiService.addPlanControle(newPlan).subscribe(
      () => {
        console.log('Plan de contrôle ajouté');
        this.loadPlansControle();
        this.resetForm();
      },
      (error) => this.handleApiError(error)
    );




  }

  editPlanControle(plan: PlanControle): void {
    this.planControle = { ...plan };
    this.nom = plan.nom;
    this.selectedProduitId = plan.produit_id;
  }

  updatePlanControle(): void {
    this.submitted = true;

    if (!this.planControle || !this.nom || !this.selectedProduitId) {
      this.errorMessage = 'Tous les champs sont obligatoires';
      return;
    }

    const updatedPlan = {
      plan_id: this.planControle.plan_id,
      nom: this.nom.charAt(0).toUpperCase() + this.nom.slice(1),
      produit_id: this.selectedProduitId
    };
    if (!this.planControle.plan_id) {
      console.error("Erreur: Aucun ID de plan de contrôle sélectionné !");
      return;
    }
    this.apiService.updatePlanControle(this.planControle.plan_id,updatedPlan).subscribe(
      () => {
        console.log('Plan de contrôle mis à jour');
        this.loadPlansControle();
        this.resetForm();
      },
      (error) => console.error('Erreur lors de la mise à jour:', error)
    );
  }

  deletePlanControle(id: number): void {
    console.log("Deleting plan with ID:", id);
    if (confirm('Voulez-vous vraiment supprimer ce plan de contrôle ?')) {
      this.apiService.deletePlanControle(id).subscribe(
        () => {
          console.log('Plan de contrôle supprimé');
          this.loadPlansControle();
        },
        (error) => console.error('Erreur lors de la suppression:', error)
      );
    }
  }

  handleApiError(error: any): void {
    if (error.status === 401) {
      this.authService.handleUnauthorized();
    } else if (error.status === 400 && error.error.error === 'Plan already exists for this product') {
      this.errorMessage = 'Ce produit a déjà un plan de contrôle.';
    } else {
      console.error('Erreur API:', error);
      this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
    }
  }

  resetForm(): void {
    this.submitted = false;
    this.planControle = null;
    this.nom = '';
    this.selectedProduitId = null;
    this.errorMessage = '';
  }

  getProductName(produit_id: number): string {
    const produit = this.produits.find(p => p.id === produit_id);
    if(!produit){
      console.warn(`Produit with id ${produit_id} not found`)
    }
    return produit ? produit.nom : 'Non défini';
  }
  changePagePlansControle(direction: string): void {
    if (direction === 'previous' && this.page > 1) {
      this.page--;
    } else if (direction === 'next' && this.page < this.paginatePlansControle.length) {
      this.page++;
    }
  }

  setPagePlansControle(pageNumber: number): void {
    this.page = pageNumber;
  }

  get paginatePlansControle(): number[] {
    const pageCount = Math.ceil(this.plansControle.length / this.itemsPerPage);
    return Array(pageCount).fill(0).map((_, index) => index + 1);
  }
}
