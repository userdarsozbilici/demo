import { Routes } from '@angular/router'
import { RegistrationMainPageComponent } from '../pages/registration/main-page/main-page.component'
import { RegistrationComponent } from '../pages/registration/registration/registration.component'
import { RegistrationHomeComponent } from '../pages/registration/registration-home/registration-home.component'
import { DashboardComponent } from '../pages/registration/dashboard/dashboard.component'
import { RegisterComponent } from '../pages/common/register/register.component'
import { LoginComponent } from '../pages/common/login/login.component'
import { AuthGuard, PreventAuthAccessGuard } from '../helpers/guards/auth-guard/auth.guard'
import { AdmissionHomeComponent } from '../pages/admission/admission-home/admission-home.component'
import { AdmissionMainComponent } from '../pages/admission/main/admission-main.component'
import { AdmissionTableComponent } from '../pages/admission/admisson-table/admission-table.component'
import { AdministrationHomeComponent } from '../pages/administration/administration-home/administration-home.component'
import { PatientQueueComponent } from '../pages/policlinic/patient-queue/patient-queue.component'
import { PoliclinicHomeComponent } from '../pages/policlinic/policlinic-home/policlinic-home.component'

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'administration-home', component: AdministrationHomeComponent },
  { path: 'registration-home', component: RegistrationHomeComponent, canActivate: [AuthGuard] },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  { path: 'patients', component: RegistrationMainPageComponent, canActivate: [AuthGuard] },
  {
    path: 'registration',
    component: RegistrationComponent,
    canActivate: [AuthGuard],
  },
  { path: 'admission-home', component: AdmissionHomeComponent, canActivate: [AuthGuard] },
  { path: 'admission-main', component: AdmissionMainComponent, canActivate: [AuthGuard] },
  { path: 'admission-table', component: AdmissionTableComponent, canActivate: [AuthGuard] },

  { path: 'policlinic-home', component: PoliclinicHomeComponent, canActivate: [AuthGuard] },
  { path: 'policlinic-queue', component: PatientQueueComponent, canActivate: [AuthGuard] },

]
