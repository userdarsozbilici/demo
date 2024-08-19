import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Patient } from '../models/patient.model';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { PatientService } from '../services/patient.service';
import { ComboBoxService } from '../services/combo-box.service';
import { NavigateHomeButtonComponent } from '../navigate-home-button/navigate-home-button.component';
import { ToastrService } from 'ngx-toastr';
import { ComboBoxComponent } from '../combo-box/combo-box.component';
import { PatientDetailsModalComponent } from '../patient-details-modal/patient-details-modal.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    NavigateHomeButtonComponent,
    ComboBoxComponent,
    PatientDetailsModalComponent,
  ],
  selector: 'app-patients-table',
  templateUrl: './patients-table.component.html',
  styleUrls: ['./patients-table.component.css'],
})
export class PatientsTableComponent implements OnInit {
  @Input() patients: Patient[] = [];
  @Output() resetSearch = new EventEmitter<void>();
  first = 0;
  totalRecords = 0;
  rows = 5;
  currentPage = 1;
  totalPages = 1;
  displayModal = false;
  selectedPatient: Patient | null = null;
  phoneType: 'mobile' | 'home' | 'office' = 'mobile';
  isEditMode = false;
  sortOrder: 'asc' | 'desc' | null = 'asc'; // Track sort order, initialized to null

  loadingBirthPlace = true;
  loadingResidence = true;

  constructor(
    private patientService: PatientService,
    private comboBoxService: ComboBoxService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.totalRecords = this.patients.length;
    this.totalPages = Math.ceil(this.totalRecords / this.rows);
    this.sortPatientsById();

    this.loadCityNames();
  }

  loadCityNames() {
    this.patients.forEach((patient) => {
      this.comboBoxService.getCityNameByCountyId(patient.birthPlace).subscribe({
        next: (cityName) => {
          patient.birthPlaceName = cityName;
          this.loadingBirthPlace = false;
        },
        error: () => {
          this.loadingBirthPlace = false;
          this.toastr.error('Doğum yeri yüklenirken bir hata oluştu.');
        },
      });

      this.comboBoxService.getCityNameByCountyId(patient.residence).subscribe({
        next: (cityName) => {
          patient.residenceName = cityName;
          this.loadingResidence = false;
        },
        error: () => {
          this.loadingResidence = false;
          this.toastr.error('Yaşadığı yer yüklenirken bir hata oluştu.');
        },
      });
    });
  }

  onPage(event: any) {
    this.first = event.first;
    this.currentPage = this.first / this.rows + 1;
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.first = (this.currentPage - 1) * this.rows;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.first = (this.currentPage - 1) * this.rows;
    }
  }

  openModal(patient: Patient) {
    this.selectedPatient = {
      ...patient,
      phoneNumbers:
        patient.phoneNumbers.length > 0
          ? patient.phoneNumbers
          : [{ mobilePhone: '', officePhone: '', homePhone: '' }],
    };
    this.displayModal = true;
    this.isEditMode = false;
  }

  closeModal() {
    this.displayModal = false;
  }

  enableEditMode() {
    this.isEditMode = true;
  }

  disableEditMode() {
    this.isEditMode = false;
  }

  savePatient() {
    if (this.selectedPatient) {
      this.patientService.updatePatient(this.selectedPatient).subscribe({
        next: () => {
          const index = this.patients.findIndex(
            (p) => p.id === this.selectedPatient!.id
          );
          if (index !== -1) {
            this.patients[index] = this.selectedPatient!;
          }
          this.toastr.success(
            `${this.selectedPatient?.firstName} ${this.selectedPatient?.lastName} hasta bilgileri başarıyla güncellendi!`
          );
          this.displayModal = false;
        },
        error: (err) =>
          this.toastr.error(
            `${this.selectedPatient?.firstName} ${this.selectedPatient?.lastName} hasta bilgileri güncellenemedi!`
          ),
      });
    }
  }

  deletePatient() {
    if (this.selectedPatient) {
      this.patientService.deletePatient(this.selectedPatient.id!).subscribe({
        next: () => {
          this.patients = this.patients.filter(
            (p) => p.id !== this.selectedPatient!.id
          );
          this.toastr.success(
            `${this.selectedPatient?.firstName} ${this.selectedPatient?.lastName} hasta başarıyla silindi!`
          );
          this.displayModal = false;
        },
        error: (err) =>
          this.toastr.error(
            `${this.selectedPatient?.firstName} ${this.selectedPatient?.lastName} hasta kaydı silinemedi!`
          ),
      });
    }
  }

  newQuery() {
    this.resetSearch.emit();
  }

  togglePhoneType() {
    if (this.phoneType === 'mobile') {
      this.phoneType = 'home';
    } else if (this.phoneType === 'home') {
      this.phoneType = 'office';
    } else {
      this.phoneType = 'mobile';
    }
  }

  getPhoneNumber(patient: Patient) {
    switch (this.phoneType) {
      case 'home':
        return patient.phoneNumbers[0]?.homePhone || '-';
      case 'office':
        return patient.phoneNumbers[0]?.officePhone || '-';
      default:
        return patient.phoneNumbers[0]?.mobilePhone || '-';
    }
  }

  getPhoneIcon() {
    switch (this.phoneType) {
      case 'home':
        return 'pi pi-home';
      case 'office':
        return 'pi pi-briefcase';
      default:
        return 'pi pi-mobile';
    }
  }

  sortPatientsById() {
    if (this.sortOrder === null) {
      this.sortOrder = 'asc';
    }

    if (this.sortOrder === 'asc') {
      this.patients.sort((a, b) => a.id! - b.id!);
    } else {
      this.patients.sort((a, b) => b.id! - a.id!);
    }

    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  }

  getSortIcon() {
    return this.sortOrder === 'desc'
      ? 'pi pi-sort-amount-up-alt'
      : 'pi pi-sort-amount-down-alt';
  }
}
