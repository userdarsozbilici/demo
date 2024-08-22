import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientSearchComponent } from '../patient-search/patient-search.component';
import { PatientService } from '../../../services/patient.service';
import { Patient } from '../../../models/patient.model';
import { AdmissionRegisterComponent } from '../admission-register/admission-register.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admission-main',
  standalone: true,
  imports: [CommonModule, PatientSearchComponent, AdmissionRegisterComponent],
  templateUrl: './admission-main.component.html',
  styleUrls: ['./admission-main.component.css'],
  providers: [PatientService]
})
export class AdmissionMainComponent {
  patientSelected = false;
  selectedPatient: Patient | null = null;

  constructor(
    private patientService: PatientService,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService
  ) {}


  onPatientSearch(searchCriteria: { searchByPatient: string; patientSearchTerm: string }) {
    this.patientService.searchPatients(searchCriteria.searchByPatient, searchCriteria.patientSearchTerm).subscribe(
      (patients: Patient[]) => {
        if (patients.length > 0) {
          this.selectedPatient = patients[0];
          this.patientSelected = true;
          this.cd.detectChanges();  
        } else {
          this.selectedPatient = null;
          this.patientSelected = false;
          this.toastr.error("Aradığınız kriterde hasta kaydı bulunamadı.");
          this.toastr.info("Lütfen hastayı kayıt masasına gönderin ya da başka bilgilerle tekrar deneyin.");
        }
      },
      (error) => {
        console.error('Error fetching patient data', error);
        this.toastr.error('Hasta arama işlemi sırasında bir hata oluştu.');
      }
    );
  }

  onAdmissionRegistered() {
    this.selectedPatient = null;
    this.patientSelected = false;
    this.toastr.success('Hasta kabul başarıyla oluşturuldu.');
    this.cd.detectChanges(); 
  }
}
