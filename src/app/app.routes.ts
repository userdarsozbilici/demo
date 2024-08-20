import { Routes } from '@angular/router'
import { MainPageComponent } from './main-page/main-page.component'
import { RegistrationComponent } from './registration/registration.component'
import { HomeComponent } from './home/home.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { RegisterComponent } from './register/register.component'
import { LoginComponent } from './login/login.component'
import { AuthGuard, PreventAuthAccessGuard } from './auth.guard'

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  { path: 'patients', component: MainPageComponent, canActivate: [AuthGuard] },
  {
    path: 'registration',
    component: RegistrationComponent,
    canActivate: [AuthGuard],
  },
]
