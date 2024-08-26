import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Subscription, interval, forkJoin } from 'rxjs';
import { Admission } from '../../../models/admission.model';
import { AdmissionService } from '../../../services/admission.service';
import { PatientService } from '../../../services/patient.service';
import { PoliclinicService } from '../../../services/policlinic.service'; 
import { Patient } from '../../../models/patient.model';
import { LoadingSpinnerComponent } from '../../../common-components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-patient-queue',
  standalone: true,
  templateUrl: './patient-queue.component.html',
  styleUrls: ['./patient-queue.component.css'],
  imports: [CommonModule, TableModule, LoadingSpinnerComponent],
  providers: [AdmissionService, PatientService, PoliclinicService, LoadingSpinnerComponent]
})
export class PatientQueueComponent implements OnInit, OnDestroy {
  currentPatient: { admission: Admission, patient: Patient } | null = null;
  queue: { admission: Admission, patient: Patient }[] = [];
  paginatedQueue: { admission: Admission, patient: Patient | null }[] = [];
  private refreshSubscription!: Subscription;
  private pageChangeSubscription!: Subscription;
  first = 0;
  rows = 3;
  policlinicName: string = '';
  loading: boolean = true;

  constructor(
    private admissionService: AdmissionService,
    private patientService: PatientService,
    private policlinicService: PoliclinicService
  ) {}

  ngOnInit(): void {
    this.loadPoliclinicData();
    this.loadQueueData();
    this.startPolling();
    this.startPageChange();
  }

  ngOnDestroy(): void {
    this.stopPolling();
    this.stopPageChange();
  }

  loadPoliclinicData() {
    const policlinicId = this.getPoliclinicIdFromLocalStorage();

    if (policlinicId) {
      this.policlinicService.getPoliclinicById(policlinicId).subscribe(
        (policlinic) => {
          this.policlinicName = policlinic.name;
          this.loading = false;
        },
        (error) => {
          console.error('Failed to load policlinic:', error);
          this.loading = false;
        }
      );
    } else {
      this.policlinicName = 'Unknown Policlinic';
      this.loading = false;
    }
  }

  loadQueueData() {
    const policlinicId = this.getPoliclinicIdFromLocalStorage();

    if (!policlinicId) {
        console.error('Policlinic ID is not available in local storage.');
        this.loading = false;
        return;
    }

    this.admissionService.getOpenedAdmissionsByTypeAndPoliclinic('outpatient', policlinicId).subscribe(async (response: any) => {
        let admissions: Admission[] = response.data;

        admissions.sort((a, b) => {
            const dateA = a.admissionDate ? new Date(a.admissionDate).getTime() : 0;
            const dateB = b.admissionDate ? new Date(b.admissionDate).getTime() : 0;
            return dateA - dateB;
        });

        if (admissions.length > 0) {
            const currentAdmission = admissions[0];
            const queueAdmissions = admissions.slice(1);

            try {
                const patients = await Promise.all([
                    this.patientService.getPatientById(currentAdmission.patientId).toPromise(),
                    ...queueAdmissions.map((admission: Admission) => this.patientService.getPatientById(admission.patientId).toPromise())
                ]);

                if (patients[0]) {
                    this.currentPatient = { admission: currentAdmission, patient: patients[0] as Patient };
                    this.patientService.setCurrentPatient(patients[0] as Patient); 

                    this.queue = queueAdmissions.map((admission: Admission, index: number) => ({
                        admission,
                        patient: patients[index + 1] as Patient
                    })).filter(entry => entry.patient); 

                    this.updatePaginatedQueue();
                } else {
                    this.currentPatient = null;
                    this.queue = [];
                    this.paginatedQueue = [];
                }
            } catch (error) {
                console.error('Error loading patients:', error);
            } finally {
                this.loading = false;
            }
        } else {
            this.currentPatient = null;
            this.queue = [];
            this.paginatedQueue = [];
            this.loading = false;
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
    this.paginatedQueue = this.queue.slice(this.first, this.first + this.rows);

    if (this.paginatedQueue.length < this.rows) {
      this.paginatedQueue = this.paginatedQueue.concat(new Array(this.rows - this.paginatedQueue.length).fill(null));
    }
  }

  getOrderNumber(index: number): number | string {
    const entry = this.paginatedQueue[index];
    return entry ? this.first + index + 1 : 'N/A';
  }

  getTypeLabel(entry: { admission: Admission, patient: Patient } | null): string {
    if (entry && entry.admission && entry.patient) {
      return 'Ayakta Tedavi';
    }
    return '';
  }
}
