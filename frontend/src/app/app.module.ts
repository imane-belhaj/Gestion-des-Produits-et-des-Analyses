import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {provideHttpClient,withFetch} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { ProduitsComponent } from './produits/produits.component';
import { AnalysesComponent } from './analyses/analyses.component';
import { NavbarComponent } from './navbar/navbar.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    AnalysesComponent,
    NavbarComponent,
    ProduitsComponent,
    HomeComponent,
    ProfileComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgxPaginationModule






  ],
  exports: [
    NavbarComponent
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch())
  ]
})
export class AppModule { }
