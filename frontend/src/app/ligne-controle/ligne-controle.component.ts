import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

interface PlanControle {
  plan_id: number;
  nom: string;
}

interface LigneControle {
  ligne_id: number;
  nom: string;
  plan_id: number;
  plan_nom: string;
  created_by:string;
  date_creation: string;
  user_id: number;

}

@Component({
  selector: 'app-ligne-controle',
  templateUrl: './ligne-controle.component.html',
  styleUrls: ['./ligne-controle.component.css'],
  standalone: false
})
export class LigneControleComponent implements OnInit {
  plansControle: PlanControle[] = [];
  lignesControle: LigneControle[] = [];
  ligneToEdit: LigneControle | null = null;
  nom: string = '';
  selectedPlanId: number | null = null;
  submitted: boolean = false;
  errorMessage: string = '';
  page: number = 1;
  itemsPerPage: number = 6;
  paginateLignes: number[] = [];

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.getPlansControle();
    this.getLignesControle();
  }
  getPlansControle(): void {
    this.apiService.getAllPlansControle().subscribe(
      (response: PlanControle[]) => {
        this.plansControle = response;
      },
      (error) => console.error('Error fetching plans de contrôle:', error)
    );
  }

  getLignesControle(): void {
    this.apiService.getAllLignesControle().subscribe(
      (response: LigneControle[]) => {
        this.lignesControle = response;
        this.paginateLignes = Array.from(
          { length: Math.ceil(this.lignesControle.length / this.itemsPerPage) },
          (_, i) => i + 1
        );

      },
      (error) => {
        console.error('Error fetching lignes:', error);
        this.errorMessage = 'An error occurred while fetching lignes data.';
      }
    );
  }


  addLigneControle(): void {
    this.submitted = true;

    if (!this.selectedPlanId || !this.nom) {
      this.errorMessage = 'Tous les champs sont obligatoires';
      return;
    }

    const userId = this.authService.getToken();
    if (!userId) {
      console.error('User not logged in');
      this.authService.handleUnauthorized();
      return;
    }

    const ligneData = {
      nom: this.nom.charAt(0).toUpperCase() + this.nom.slice(1),
      plan_id: this.selectedPlanId,
      user_id: userId
    };

    console.log("Sending data to API:", ligneData);

    this.apiService.addLigneControle(ligneData).subscribe(
      () => {
        console.log("Ligne de contrôle ajoutée");
        this.getLignesControle(); // Refresh the list
        this.resetForm(); // Reset form after adding
      },
      (error) => this.handleApiError(error)
    );
  }


  editLigneControle(ligne: LigneControle): void {
    this.ligneToEdit = { ...ligne };
    this.nom = ligne.nom;
    this.selectedPlanId = ligne.plan_id;
  }

  updateLigneControle(): void {
    this.submitted = true;

    if (!this.ligneToEdit || !this.nom || !this.selectedPlanId) {
      this.errorMessage = 'Le nom de la ligne de contrôle est obligatoire';
      return;
    }

    const updatedLigne = {
      ligne_id: this.ligneToEdit.ligne_id,
      nom: this.nom.charAt(0).toUpperCase() + this.nom.slice(1),
      plan_id: this.selectedPlanId,
    };
    const userId = this.authService.getToken();

    if (!userId) {
      console.error('User not logged in');
      this.authService.handleUnauthorized();
      return;
    }

    this.apiService.updateLigneControle(this.ligneToEdit.ligne_id,updatedLigne).subscribe(
      () => {
        console.log('Ligne de contrôle mise à jour');
        this.getLignesControle();
        this.resetForm();
      },
      (error) => console.error('Erreur lors de la mise à jour:', error)
    );
  }

  deleteLigneControle(id: number): void {
   if (confirm('Voulez-vous vraiment supprimer cet ligne de contrôle ?')) {
     this.apiService.deleteLigneControle(id).subscribe(
       () => {
         this.lignesControle = this.lignesControle.filter(lc => lc.ligne_id !== id);
       },
       (error) => console.error('Erreur lors de la suppression:', error)
     );
   }
  }

  handleApiError(error: any): void {
    if (error.status === 401) {
      this.authService.handleUnauthorized();
    } else if (error.status === 400 && error.error.error === 'Ligne de contrôle already exists') {
      this.errorMessage = 'La ligne de contrôle existe déjà.';
    } else {
      console.error('Erreur API:', error);
      this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
    }
  }

  resetForm(): void {
    this.submitted = false;
    this.ligneToEdit = null;
    this.nom = '';
    this.errorMessage = '';
    this.selectedPlanId = null;
  }


  changePageLignesControle(direction: string): void {
    if (direction === 'previous' && this.page > 1) {
      this.page--;
    } else if (direction === 'next' && this.page < this.paginateLignesControle.length) {
      this.page++;
    }
  }

  setPageLignesControle(pageNumber: number): void {
    this.page = pageNumber;
  }

  get paginateLignesControle(): number[] {
    const pageCount = Math.ceil(this.lignesControle.length / this.itemsPerPage);
    return Array(pageCount).fill(0).map((_, index) => index + 1);
  }



}
