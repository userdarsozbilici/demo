import { Routes } from '@angular/router'
import { MainPageComponent } from '../pages/registration/main-page/main-page.component'
import { RegistrationComponent } from '../pages/registration/registration/registration.component'
import { HomeComponent } from '../pages/registration/registration-home/registration-home.component'
import { DashboardComponent } from '../pages/registration/dashboard/dashboard.component'
import { RegisterComponent } from '../pages/common/register/register.component'
import { LoginComponent } from '../pages/common/login/login.component'
import { AuthGuard, PreventAuthAccessGuard } from '../helpers/guards/auth-guard/auth.guard'

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
