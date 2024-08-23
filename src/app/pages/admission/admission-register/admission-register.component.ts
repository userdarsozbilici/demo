import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Patient } from '../../../models/patient.model';
import { NavigateHomeButtonComponent } from '../../../common-components/navigate-home-button/navigate-home-button.component';
import { PoliclinicService, Policlinic } from '../../../services/policlinic.service';
import { AdmissionService } from '../../../services/admission.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admission-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    DialogModule,
    NavigateHomeButtonComponent
  ],
  templateUrl: './admission-register.component.html',
  styleUrls: ['./admission-register.component.css'],
})
export class AdmissionRegisterComponent implements OnInit {
  @Input() patient!: Patient;
  @Output() admissionRegistered = new EventEmitter<void>(); // Emit when registration is successful

  admissionForm: FormGroup;
  showDetailsDialog = false;
  admissionTypes = [
    { label: 'Ayakta', value: 'outpatient' },
    { label: 'Yatan', value: 'inpatient' },
    { label: 'Günübirlik', value: 'daily' },
  ];
  policlinics: any[] = [];

  constructor(
    private fb: FormBuilder,
    private policlinicService: PoliclinicService,
    private admissionService : AdmissionService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.admissionForm = this.fb.group({
      admissionType: ['', Validators.required],
      policlinic: ['', Validators.required],
      note: [''],
    });
  }

  ngOnInit(): void {
    this.fetchPoliclinics();
  }

  fetchPoliclinics() {
    this.policlinicService.getAllPoliclinics().subscribe({
      next: (data: Policlinic[]) => {
        this.policlinics = data.map(p => ({ label: p.name, value: p.id }));
      },
      error: (error) => {
        console.error('Error fetching policlinics:', error);
      }
    });
  }

  openDetailsDialog() {
    this.showDetailsDialog = true;
  }

  closeDetailsDialog() {
    this.showDetailsDialog = false;
  }

  onSubmit() {
    if (this.admissionForm.valid && this.patient && this.patient.id !== undefined) {
      const userId = this.authService.getUserId();
      if (userId === null) {
        console.error('User ID not found');
        return;
      }

      const admissionData = {
        patientId: this.patient.id,
        type: this.admissionForm.get('admissionType')?.value,
        policlinicId: this.admissionForm.get('policlinic')?.value,
        staffId: userId,
        note: this.admissionForm.get('note')?.value || ''
      };

      this.admissionService.createAdmission(admissionData).subscribe({
        next: () => {
          this.admissionRegistered.emit(); // Emit the event on successful registration
        },
        error: (err) => {
          console.error('Error creating admission:', err);
          this.toastr.error('Hasta kabul oluşturulurken bir hata oluştu.');
        }
      });
    } else {
      console.error('Form is invalid or patient ID is undefined');
    }
  }
}
