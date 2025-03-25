import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

interface Unit {
  id: number;
  nom: string;
  symbole: string;
}
interface Analyse {
  id: number;
  nom_analyse: string;
  valeur_min: number;
  valeur_max: number;
  created_by: string;
  unit?: string;
}

@Component({
  selector: 'app-analyses',
  templateUrl: './analyses.component.html',
  styleUrls: ['./analyses.component.css'],
  standalone: false
})
export class AnalysesComponent implements OnInit {
  nom_analyse: string = '';
  valeur_min: number | undefined;
  valeur_max: number | undefined;
  analyses: Analyse[] = [];
  analyseToEdit: Analyse | null = null;
  units: Unit[] = [];
  selectedUnit = '';
  unitNotFound = false;
  isAddingUnit = false;

  newUnitName: string = '';
  newUnitSymbol: string = '';
  errorMessage: string = '';
  submitted: boolean = false;
  page: number = 1;
  itemsPerPage: number = 6;
  paginateAnalyses: number[] = [];

  /*
  addNewUnit(): void {
    this.isAddingUnit = true;
    this.unitNotFound = true;
  }*/

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getAnalyses();
    this.getUnits();
  }

  getAnalyses(): void {
    this.apiService.getAnalyses().subscribe(
      (response: any) => {
        this.analyses = response.map((analyse: any) => {
          analyse.user = analyse.user || {firstname: '', lastname: ''};
          return analyse;
        });
        this.paginateAnalyses = Array.from({length: Math.ceil(this.analyses.length / this.itemsPerPage)}, (_, i) => i + 1);
      },
      (error: any) => {
        console.error('Error fetching analyses:', error);
      }
    )
  }

  getUnits(): void {
    this.apiService.getAllUnits().subscribe(
      (response: any) => {
        this.units = response;
      },
      (error: any) => {
        console.error('Error fetching units:', error);
      }
    );
  }

  saveUnit(): void {
    console.log('saveUnit method called');
    console.log('newUnitName:', this.newUnitName);
    console.log('newUnitSymbol:', this.newUnitSymbol);

    if (this.newUnitName && this.newUnitSymbol) {
      this.apiService.addUnit({
        nom: this.newUnitName,
        symbole: this.newUnitSymbol
      }).subscribe(response => {
        console.log('Unit added:', response);
        this.getUnits();
        this.closeUnitModal();
      }, error => {
        console.error('Error adding unit:', error);
      });
    } else {
      alert('Please enter both unit name and symbol.');
    }
  }

  // Add
  addAnalyse(): void {
    this.errorMessage = '';
    this.submitted = true;

    if (!this.selectedUnit) {
      this.errorMessage = 'Veuillez sélectionner une unité';
      return;
    }

    console.log('Form data before submitting: ',{
      nom_analyse: this.nom_analyse,
      valeur_max: this.valeur_max,
      valeur_min: this.valeur_min,
      unit_id: this.selectedUnit
    })
    if (this.nom_analyse === '' || this.valeur_min === undefined || this.valeur_max === undefined) {
      this.errorMessage = 'Tous les champs doivent être remplis ';
      return;
    }
    if (this.valeur_min >= this.valeur_max) {
      this.errorMessage = 'La valeur minimale doit être inférieure à la valeur maximale';
      return;
    }
    this.nom_analyse = this.nom_analyse.charAt(0).toUpperCase() + this.nom_analyse.substring(1);
    const newAnalyse = {
      nom_analyse: this.nom_analyse,
      valeur_max: this.valeur_max,
      valeur_min: this.valeur_min,
      unit_id: this.selectedUnit || undefined,
    };
    console.log('Selected Unit from the Add:', this.selectedUnit);
    this.apiService.addAnalyse(newAnalyse).subscribe((response) => {
      console.log('Analysis created:', response);
      this.getAnalyses();
      this.resetForm();
    }, (error) => {
      console.error('Error adding analyses :', error);
    });
  }

  updateAnalyse(): void {
    if (!this.analyseToEdit || this.valeur_min === undefined || this.valeur_max === undefined) {
      this.errorMessage = 'Invalid data for update';
      return;
    }
    if (isNaN(this.valeur_min) || isNaN(this.valeur_max)) {
      this.errorMessage = 'Les valeurs minimales et maximales doivent être des nombres valides ';
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
      unit: this.selectedUnit || this.analyseToEdit.unit,
    };
    console.log('Selected Unit from the Update :', this.selectedUnit);
    this.apiService.updateAnalyse(updatedAnalyse).subscribe((response) => {
      console.log('Analyses updated:', response);
      this.getAnalyses();
      this.resetForm();
    }, (error) => {
      console.error('Error updating analyses :', error);
    })
  }

  // Edit
  editAnalyse(analyse: any): void {
    this.analyseToEdit = { ...analyse };
    this.nom_analyse = analyse.nom_analyse;
    this.valeur_min = analyse.valeur_min;
    this.valeur_max = analyse.valeur_max;
    this.selectedUnit = analyse.unit || '';
    console.log('Selected Unit edit:', this.selectedUnit);

  }

  // Delete
  deleteAnalyse(id: number): void {
    this.apiService.deleteAnalyse(id).subscribe(() => {
      console.log('Analyse deleted successfully');
      this.analyses = this.analyses.filter(analyse => analyse.id !== id);
    }, (error) => {
      console.error('Error deleting analyse :', error);
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
    this.analyseToEdit = null;
    this.nom_analyse = '';
    this.valeur_min = undefined;
    this.valeur_max = undefined;
    this.selectedUnit = '';
    this.errorMessage = '';
  }


  openUnitModal(): void {
    // Using JavaScript to trigger the modal display
    const modal = document.getElementById('unitModal') as HTMLElement;
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }
  closeUnitModal(): void {
    const modal = document.getElementById('unitModal') as HTMLElement;
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  }


  //add new unit
  saveNewUnit(): void {
    if (!this.newUnitSymbol) {
      this.errorMessage = 'Le symbole de l\'unité est obligatoire';
      return;
    }
    const newUnit = {
      nom: this.newUnitSymbol
    };
    this.apiService.addUnit(newUnit).subscribe((response) => {
      console.log('New unit added:', response);
      this.getUnits();
      this.isAddingUnit = false; // Close the modal
      this.newUnitSymbol = ''; // Reset input
    }, (error) => {
      console.error('Error adding unit:', error);
      this.errorMessage = 'Une erreur est survenue lors de l\'ajout de l\'unité.';
    });
  }
}
