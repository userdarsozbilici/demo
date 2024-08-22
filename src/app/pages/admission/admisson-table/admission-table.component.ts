import { Component, OnInit } from '@angular/core';
import { AdmissionService } from '../../../services/admission.service';
import { PoliclinicService } from '../../../services/policlinic.service';
import { PatientService } from '../../../services/patient.service';
import { ToastrService } from 'ngx-toastr';
import { NavigateHomeButtonComponent } from '../../../common-components/navigate-home-button/navigate-home-button.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-admission-table',
  templateUrl: './admission-table.component.html',
  styleUrls: ['./admission-table.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    TableModule,
    ButtonModule,
    NavigateHomeButtonComponent
  ]
})
export class AdmissionTableComponent implements OnInit {
  admissions: any[] = [];
  filteredAdmissions: any[] = [];  // Array to hold filtered admissions
  policlinics: any[] = [];
  selectedPoliclinic: any = null;
  rows = 5; // Display 5 admissions per page
  first = 0;
  totalRecords = 0;

  constructor(
    private admissionService: AdmissionService,
    private policlinicService: PoliclinicService,
    private patientService: PatientService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchPoliclinics();
    this.fetchAdmissions();
  }

  fetchPoliclinics() {
    this.policlinicService.getAllPoliclinics().subscribe({
      next: (data) => {
        this.policlinics = [{ label: 'Tümü', value: null }, ...data.map(p => ({ label: p.name, value: p.id }))];
      },
      error: (error) => {
        console.error('Error fetching policlinics:', error);
      }
    });
  }

  fetchAdmissions() {
    this.admissionService.getAllAdmissions().subscribe({
      next: (data) => {
        this.admissions = data;
        this.loadRelatedData();  // Load related data after admissions are fetched
      },
      error: (error) => {
        console.error('Error fetching admissions:', error);
      }
    });
  }

  loadRelatedData() {
    let completedRequests = 0;
    const totalRequests = this.admissions.length * 2; // patient and policlinic per admission

    this.admissions.forEach(admission => {
      this.patientService.getPatientById(admission.patientId).subscribe({
        next: (patient) => {
          admission.patientFirstName = patient.firstName;
          admission.patientLastName = patient.lastName;
          admission.patientIdentityNumber = patient.identityNumber;
          completedRequests++;
          if (completedRequests === totalRequests) {
            this.filterAdmissions();
          }
        },
        error: (error) => {
          console.error(`Error fetching patient info for ID ${admission.patientId}:`, error);
        }
      });

      this.policlinicService.getPoliclinicById(admission.policlinicId).subscribe({
        next: (policlinic) => {
          admission.policlinicName = policlinic.name;
          completedRequests++;
          if (completedRequests === totalRequests) {
            this.filterAdmissions();
          }
        },
        error: (error) => {
          console.error(`Error fetching policlinic info for ID ${admission.policlinicId}:`, error);
        }
      });
    });
  }

  filterAdmissions() {
    if (this.selectedPoliclinic !== null) {
      this.filteredAdmissions = this.admissions.filter(admission => admission.policlinicId === this.selectedPoliclinic);
    } else {
      this.filteredAdmissions = [...this.admissions];  
    }
    this.totalRecords = this.filteredAdmissions.length;
  }

  onPoliclinicChange() {
    this.filterAdmissions(); 
  }

  onPage(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  deleteAdmission(id: number) {
    this.admissionService.deleteAdmission(id).subscribe({
      next: () => {
        this.toastr.success('Hasta kabul başarıyla silindi.');
        this.admissions = this.admissions.filter(admission => admission.id !== id);
        this.filterAdmissions();
      },
      error: (err) => {
        console.error('Error deleting admission:', err);
        this.toastr.error('Hasta kabul silinirken bir hata oluştu.');
      }
    });
  }
}
