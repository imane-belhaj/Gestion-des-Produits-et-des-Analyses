import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from './auth/register/register.component';
import {ProfileComponent} from "./profile/profile.component";
import {HomeComponent} from "./home/home.component";
import {ProduitsComponent} from './produits/produits.component';
import {AnalysesComponent} from './analyses/analyses.component';
import {LigneControleComponent} from './ligne-controle/ligne-controle.component';
import {PlanControlesComponent} from './plan-controles/plan-controles.component'

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register',component: RegisterComponent},
  {path: 'profile', component: ProfileComponent},
  {path:'home', component:HomeComponent},
  {path:'produits' ,component:ProduitsComponent},
  {path:'analyses', component:AnalysesComponent},
  {path:'login', component:LoginComponent},
  {path:'lignes', component:LigneControleComponent},
  {path:'plans',component:PlanControlesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
