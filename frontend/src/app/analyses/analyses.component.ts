import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import {AuthService} from '../services/auth.service';
import {Router,RouterLink} from '@angular/router';

interface Analyse {
  id: number;
  nom_analyse: string;
  valeur_min: number;
  valeur_max: number;
  created_by: string;

}

@Component({
  selector: 'app-analyses',
  templateUrl: './analyses.component.html',
  styleUrls: ['./analyses.component.css'],
  standalone:false
})

export class AnalysesComponent implements OnInit {
  nom_analyse: string = '';
  valeur_min: number | undefined;
  valeur_max: number | undefined;
  analyses: Analyse[] = [];
  analyseToEdit: Analyse | null = null;
  errorMessage: string = '';
  submitted: boolean = false;
  page: number = 1;
  itemsPerPage: number = 4;
  paginateAnalyses: number[] = [];


  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getAnalyses();
  }
// Get list of all analyses
 /* getAnalyses(): void {
    this.apiService.getAnalyses().subscribe(
      (response : Analyse[]) => {
        this.analyses = response.map(analyse => ({
          ...analyse,
          created_by: analyse.created_by // This makes sure `created_by` is available
        }));
      },
      (error:any) => {
        console.log('Error fetching analyses:', error);
      }
    );
  }*/
  getAnalyses(): void {
    this.apiService.getAnalyses().subscribe(
      (response: any) => {
        this.analyses = response.map((analyse: any) => {
          analyse.user = analyse.user || {firstname:'', lastname:''};
          return analyse;
        }) ;
        this.paginateAnalyses = Array.from({length : Math.ceil(this.analyses.length / this.itemsPerPage )}, (_, i) => i + 1);
      },
      (error: any) => {
        console.error('Error fetching produits:', error);
      }
    )
  }


  // Add a new analysis
  addAnalyse(): void {
    this.errorMessage = '';
    this.submitted = true;
    if (this.nom_analyse === '' || this.valeur_min === undefined || this.valeur_max === undefined) {
      this.errorMessage = 'Tous les champs doivent être remplis ';
      return;
    }
    if (this.valeur_min >= this.valeur_max) {
      this.errorMessage ='La valeur minimale doit être inférieure à la valeur maximale';
      return;
    }
    this.nom_analyse = this.nom_analyse.charAt(0).toUpperCase() + this.nom_analyse.substring(1);
    const newAnalyse = {
      nom_analyse: this.nom_analyse,
      valeur_min: this.valeur_min,
      valeur_max: this.valeur_max,
    };

    this.apiService.addAnalyse(newAnalyse).subscribe((response) => {
      console.log('Analysis created:', response);
      this.getAnalyses();
      this.resetForm();
    }, (error) => {
      this.handleApiError(error);
      }
    );
  }

  updateAnalyse(): void {

    if (!this.analyseToEdit || this.valeur_min === undefined || this.valeur_max === undefined) {
      this.errorMessage = 'Invalid data for update';
      return;
    }
    if (isNaN(this.valeur_min) || isNaN(this.valeur_max)) {
      this.errorMessage = 'Les valeurs minimales et maximales doivent être des nombres valides '
      return;
    }
    if (this.valeur_min >= this.valeur_max) {
      this.errorMessage = 'La valeur minimale doit être inférieure à la valeur maximale';
      return;
    }
    this.nom_analyse = this.nom_analyse.charAt(0).toUpperCase() + this.nom_analyse.substring(1);
    const updatedAnalyse = {
      ...this.analyseToEdit,
      nom_analyse: this.nom_analyse,
      valeur_min: this.valeur_min,
      valeur_max: this.valeur_max,
    };
    this.apiService.updateAnalyse(updatedAnalyse).subscribe((response) => {
      console.log('Analyses updated:', response);
      this.getAnalyses();
      this.resetForm();
    }, (error) => {
      console.error('Error updating analyses :',error);
    })
  }
  // Edit an existing analysis
  editAnalyse(analyse: any): void {
    this.analyseToEdit = { ...analyse};
    this.nom_analyse = analyse.nom_analyse;
    this.valeur_min = analyse.valeur_min;
    this.valeur_max = analyse.valeur_max;
  }

  // Delete an analysis
  deleteAnalyse(id: number): void {
    this.apiService.deleteAnalyse(id).subscribe(() => {
      console.log('Analyse deleted successfully');
      this.analyses = this.analyses.filter(analyse => analyse.id !== id);
    }, (error) => {
      console.error('Error deleting analyse :',error);
    });
  }

  setPageAnalyses(pageNum: number): void {
    this.page = pageNum;
  }

  changePageAnalyses(direction: string): void {
    if (direction === 'previous' && this.page > 1) {
      this.page--;
    } else if (direction === 'next' && this.page < this.paginateAnalyses.length) {
      this.page++;
    }
  }

  handleApiError(error: any): void {
    if (error.status === 400 && error.error.error === 'Analyse already exists') {
      this.errorMessage = 'L\'analyse existe déjà. Veuillez choisir un autre nom.';
    } else {
      console.error('API Error:', error);
      this.errorMessage = 'Une erreur inattendue est survenue. Veuillez réessayer plus tard.';
    }
  }

  resetForm(): void {
    this.submitted = false;
    this.analyseToEdit = null ;
    this.nom_analyse = '';
    this.valeur_min = undefined;
    this.valeur_max = undefined;
    this.errorMessage ='' ;
  }
}
