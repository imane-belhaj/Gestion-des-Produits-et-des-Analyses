import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from './auth/register/register.component';
import {ProfileComponent} from "./profile/profile.component";
import {HomeComponent} from "./home/home.component";
import {ProduitsComponent} from './produits/produits.component';
import {AnalysesComponent} from './analyses/analyses.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register',component: RegisterComponent},
  {path: 'profile', component: ProfileComponent},
  {path:'home', component:HomeComponent},
  {path:'produits' ,component:ProduitsComponent},
  {path:'analyses', component:AnalysesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
