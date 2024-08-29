import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../../services/patient.service';
import { Patient } from '../../../models/patient.model';
import { LoadingSpinnerComponent } from '../../../common-components/loading-spinner/loading-spinner.component';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { AdmissionService } from '../../../services/admission.service';
import { Admission } from '../../../models/admission.model';
import { forkJoin } from 'rxjs';
import { PotentialDiagnosis } from '../../../models/potential-diagnosis.model';
import { MedicineService } from '../../../services/medicine.service.ts.service';
import { PatientDiagnosisService } from '../../../services/patient-diagnosis.service';
import { ToastrService } from 'ngx-toastr';
import { PatientDiagnosis } from '../../../models/patient-diagnosis.model';
import { PoliclinicService } from '../../../services/policlinic.service';
import { Policlinic } from '../../../services/policlinic.service';
import { NavigateHomeButtonComponent } from '../../../common-components/navigate-home-button/navigate-home-button.component';

@Component({
  selector: 'app-patient-diagnosis',
  standalone: true,
  templateUrl: './patient-diagnosis.component.html',
  styleUrls: ['./patient-diagnosis.component.css'],
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, DropdownModule,TooltipModule, NavigateHomeButtonComponent],
  providers: [MessageService],
})
export class PatientDiagnosisComponent implements OnInit, OnDestroy {
  section: 'info' | 'diagnosis' = 'info';
  patient: Patient | null = null;
  admission: Admission | null = null;
  loading: boolean = true;
  diagnosis: string = '';
  prescription: string[] = [];
  selectedDrug: string | null = null;
  potentialDiagnosis: string | null = null;
  note: string = '';
  avatarUrl: string = '';
  intervalId: any;
  policlinicName: String = ''

  drugOptions: { label: string; value: string }[] = [];

  get emptySlots(): number[] {
    const totalSlots = 9; 
    const filledSlots = this.prescription.length;
    return new Array(totalSlots - filledSlots);
  }

  constructor(
    private patientService: PatientService,
    private messageService: MessageService,
    private admissionService: AdmissionService,
    private medicineService: MedicineService,
    private patientDiagnosisService: PatientDiagnosisService,
    private toastr: ToastrService,
    private policlinicService: PoliclinicService 
  ) {}

  ngOnInit(): void {
    this.loadPatientData();
    this.loadDrugOptions();
    this.loadPoliclinicName();
    this.startPolling();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startPolling() {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.loadPatientData();
      }, 5000);
    }
  }
  
  stopPolling() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null; 
    }
  }

  loadPoliclinicName(): void {
    const policlinicId = localStorage.getItem('policlinicId');
    if (policlinicId) {
      this.policlinicService.getPoliclinicById(+policlinicId).subscribe({
        next: (policlinic: Policlinic) => {
          this.policlinicName = `${policlinic.name} Polikliniği`;
        },
        error: (err) => {
          console.error('Error fetching policlinic name:', err);
          this.policlinicName = 'Poliklinik';
        }
      });
    } else {
      this.policlinicName = 'Poliklinik';
    }
  }
  

  loadDrugOptions() {
    const policlinicId = this.getPoliclinicIdFromLocalStorage();

    if (!policlinicId) {
      console.error('Policlinic ID is not available in local storage.');
      return;
    }

    this.medicineService.getMedicinesByPoliclinicId(policlinicId).subscribe((medicines: any[]) => {
      this.drugOptions = medicines.map(medicine => ({
        label: medicine.name,
        value: medicine.name
      }));

      console.log("drugoption")
    });
  }

  loadPatientData() {
    const policlinicId = this.getPoliclinicIdFromLocalStorage();
  
    if (!policlinicId) {
      console.error('Policlinic ID is not available in local storage.');
      this.loading = false;
      return;
    }
  
    this.admissionService.getOpenedAdmissionsByTypeAndPoliclinic('outpatient', policlinicId).subscribe((response: any) => {
      let admissions: Admission[] = response.data;
  
      admissions.sort((a, b) => {
        const dateA = a.admissionDate ? new Date(a.admissionDate).getTime() : 0;
        const dateB = b.admissionDate ? new Date(b.admissionDate).getTime() : 0;
        return dateA - dateB;
      });
  
      if (admissions.length > 0) {
        const currentAdmission = admissions[0];
        this.admission = currentAdmission;
        this.note = currentAdmission.note || '';
  
        forkJoin([
          this.patientService.getPatientById(currentAdmission.patientId),
        ]).subscribe((patients: Patient[]) => {
          this.patient = patients[0];
          this.loading = false;
  
          if (this.patient) {
            this.stopPolling();
          }

          this.loadDrugOptions()
  
          if (this.note && currentAdmission.id !== undefined) {
            this.loadPotentialDiagnosis(currentAdmission.id);
          } else {
            this.potentialDiagnosis = 'Sistemde potansiyel hastalık bulunmuyor.';
          }
        });
      } else {
        console.error('No admissions found.');
        this.patient = null;
        this.loading = false;
  
        this.startPolling();
      }
    });
  }
  
  loadPotentialDiagnosis(admissionId: number) {
    this.admissionService.getPotentialDiagnosesByAdmissionId(admissionId).subscribe((diagnoses: PotentialDiagnosis[]) => {
      if (diagnoses && diagnoses.length > 0) {
        this.potentialDiagnosis = diagnoses.map(d => d.diseaseName).join(', ');
      } else {
        this.potentialDiagnosis = 'Sistemde potansiyel hastalık bulunmuyor.';
      }
    });
  }

  getPoliclinicIdFromLocalStorage(): number | null {
    const policlinicId = localStorage.getItem('policlinicId');
    return policlinicId ? parseInt(policlinicId, 10) : null;
  }

  addDrug() {
    if (this.selectedDrug && !this.prescription.includes(this.selectedDrug)) {
      this.prescription.push(this.selectedDrug);
      this.selectedDrug = null;
    }
  }

  removeDrug(drug: string) {
    this.prescription = this.prescription.filter(d => d !== drug);
  }

  saveDiagnosis() {
    if (this.patient && this.admission) {
      const diagnosisData: PatientDiagnosis = {
        patientId: this.patient!.id!,
        admissionId: this.admission!.id!,
        diagnosis: this.diagnosis,
        medicineNames: this.prescription
      };

      this.patientDiagnosisService.createDiagnosis(diagnosisData).subscribe(
        response => {
          console.log('Diagnosis created:', response);
          this.toastr.success('Hasta tanısı ve reçete bilgileri başarıla kaydedilmiştir.');

          this.admissionService.closeAdmission(this.admission!.id!).subscribe(
            closeResponse => {
              console.log('Hasta kabul kaydı başarıyla kapatılmıştır', closeResponse);
              this.toastr.success('Hasta kabul kaydı başarıyla kapatılmıştır');

              this.loadPatientData();

              this.goToInfo();
            },
            closeError => {
              console.error('Error closing admission:', closeError);
              this.toastr.error('Hasta kabul kaydı kapatılamamıştır', 'Error');
            }
          );
        },
        error => {
          console.error('Error creating diagnosis:', error);
          this.toastr.error('Failed to Save Diagnosis', 'Error');
        }
      );
    } else {
      console.error('No patient or admission available to save diagnosis');
      this.toastr.error('No patient or admission available', 'Error');
    }
  }

  resetInputs() {
    this.diagnosis = '';
    this.prescription = [];
    this.selectedDrug = null;
    this.drugOptions = [];
  }

  cancel() {
    console.log('Diagnosis canceled');
    this.resetInputs();
  }

  goToDiagnosis() {
    this.loadDrugOptions();
    this.section = 'diagnosis';
  }

  goToInfo() {
    this.resetInputs();
    this.section = 'info';
  }
}
