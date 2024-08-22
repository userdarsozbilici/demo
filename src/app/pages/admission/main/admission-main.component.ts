import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientSearchComponent } from '../patient-search/patient-search.component';

@Component({
  selector: 'app-admission-main',
  standalone: true,
  imports: [CommonModule, PatientSearchComponent], // Import the PatientSearchComponent
  templateUrl: './admission-main.component.html',
  styleUrls: ['./admission-main.component.css'] // Corrected from `styleUrl`
})
export class AdmissionMainComponent {
  patientSelected = false;
  selectedPatient: any;

  onPatientSearch(patient: any) {
    this.patientSelected = true;
    this.selectedPatient = patient;
  }

}
