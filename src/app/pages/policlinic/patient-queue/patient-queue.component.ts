import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Subscription, interval, forkJoin } from 'rxjs';
import { Admission } from '../../../models/admission.model';
import { AdmissionService } from '../../../services/admission.service';
import { PatientService } from '../../../services/patient.service';
import { Patient } from '../../../models/patient.model';

@Component({
  selector: 'app-patient-queue',
  standalone: true,
  templateUrl: './patient-queue.component.html',
  styleUrls: ['./patient-queue.component.css'],
  imports: [CommonModule, TableModule],
  providers: [AdmissionService, PatientService]
})
export class PatientQueueComponent implements OnInit, OnDestroy {
  currentPatient: { admission: Admission, patient: Patient } | null = null;
  queue: { admission: Admission, patient: Patient }[] = [];
  paginatedQueue: { admission: Admission, patient: Patient }[] = [];
  private refreshSubscription!: Subscription;
  private pageChangeSubscription!: Subscription;
  first = 0;
  rows = 3;  // Number of rows per page

  constructor(
    private admissionService: AdmissionService,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.loadQueueData();
    this.startPolling();
    this.startPageChange();
  }

  ngOnDestroy(): void {
    this.stopPolling();
    this.stopPageChange();
  }

  loadQueueData() {
    const policlinicId = this.getPoliclinicIdFromLocalStorage();
    
    if (!policlinicId) {
      console.error('Policlinic ID is not available in local storage.');
      return;
    }

    this.admissionService.getOpenedAdmissionsByTypeAndPoliclinic('outpatient', policlinicId).subscribe((response: any) => {
      let admissions: Admission[] = response.data;
      
      // Sort the admissions by date, first come first served
      admissions.sort((a, b) => {
        const dateA = a.admissionDate ? new Date(a.admissionDate).getTime() : 0;
        const dateB = b.admissionDate ? new Date(b.admissionDate).getTime() : 0;
        return dateA - dateB;
      });

      if (admissions.length > 0) {
        const currentAdmission = admissions[0];
        const queueAdmissions = admissions.slice(1);

        forkJoin([
          this.patientService.getPatientById(currentAdmission.patientId),
          ...queueAdmissions.map((admission: Admission) => this.patientService.getPatientById(admission.patientId))
        ]).subscribe((patients: Patient[]) => {
          this.currentPatient = { admission: currentAdmission, patient: patients[0] };
          this.queue = queueAdmissions.map((admission: Admission, index: number) => ({
            admission,
            patient: patients[index + 1]
          }));
          this.updatePaginatedQueue();
        });
      } else {
        this.currentPatient = null;
        this.queue = [];
        this.paginatedQueue = [];
      }
    });
  }

  getPoliclinicIdFromLocalStorage(): number | null {
    const policlinicId = localStorage.getItem('policlinicId');
    return policlinicId ? parseInt(policlinicId, 10) : null;
  }

  startPolling() {
    this.refreshSubscription = interval(5000).subscribe(() => {
      this.loadQueueData();
    });
  }

  stopPolling() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  startPageChange() {
    this.pageChangeSubscription = interval(5000).subscribe(() => {
      this.changePage();
    });
  }

  stopPageChange() {
    if (this.pageChangeSubscription) {
      this.pageChangeSubscription.unsubscribe();
    }
  }

  changePage() {
    const totalPages = Math.ceil(this.queue.length / this.rows);
    this.first = (this.first + this.rows) % (totalPages * this.rows);
    this.updatePaginatedQueue();
  }

  updatePaginatedQueue() {
    // Get the current page's patients
    this.paginatedQueue = this.queue.slice(this.first, this.first + this.rows);

    // Pad with empty rows if necessary to ensure 3 rows are always displayed
    while (this.paginatedQueue.length < this.rows) {
      this.paginatedQueue.push({ admission: {} as Admission, patient: {} as Patient });
    }
  }

  getOrderNumber(index: number): number {
    return this.first + index + 1;
  }

  getTypeLabel(entry: { admission: Admission, patient: Patient }): string {
    if (entry && entry.admission && entry.patient && entry.patient.firstName && entry.patient.lastName) {
      return 'Ayakta Tedavi';
    }
    return '';  // Return an empty string if the entry is empty or incomplete
  }
}
