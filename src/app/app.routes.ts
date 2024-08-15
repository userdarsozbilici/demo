import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent},
  { path: 'patients', component: MainPageComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: '',  component: HomeComponent}
];
