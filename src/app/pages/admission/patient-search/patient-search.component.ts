import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastrService } from 'ngx-toastr';
import { NavigateHomeButtonComponent } from '../../../common-components/navigate-home-button/navigate-home-button.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    NavigateHomeButtonComponent,
  ],
  selector: 'app-patient-search',
  templateUrl: './patient-search.component.html',
  styleUrls: ['./patient-search.component.css'],
})
export class PatientSearchComponent implements OnInit {
  patientSearchForm!: FormGroup;
  @Output() searchPatient = new EventEmitter<{
    searchByPatient: string;
    patientSearchTerm: string;
  }>();

  patientSearchOptions = [
    { label: 'TC Kimlik', value: 'identityNumber' },
    { label: 'Hasta No', value: 'id' },
    { label: 'Ad Soyad', value: 'nameSurname' },
  ];
  selectedPatientPlaceholder = 'TC Kimlik';

  constructor(private fb: FormBuilder, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.patientSearchForm = this.fb.group({
      searchByPatient: ['identityNumber', Validators.required],
      patientSearchTerm: ['', Validators.required],
    });
  }

  onPatientSearchByChange(event: any) {
    const selectedValue = event.value;
    switch (selectedValue) {
      case 'identityNumber':
        this.selectedPatientPlaceholder = 'TC Kimlik';
        break;
      case 'id':
        this.selectedPatientPlaceholder = 'Hasta No';
        break;
      case 'nameSurname':
        this.selectedPatientPlaceholder = 'Ad Soyad';
        break;
    }
    this.patientSearchForm.get('patientSearchTerm')?.setValue('');
  }

  onSearchPatient() {
    if (this.patientSearchForm.valid) {
      const searchByPatient = this.patientSearchForm.get('searchByPatient')?.value;
      const patientSearchTerm = this.patientSearchForm.get('patientSearchTerm')?.value;
      if (searchByPatient === 'nameSurname') {
        const [firstName, lastName] = patientSearchTerm.split(' ');
        this.searchPatient.emit({
          searchByPatient: 'nameSurname',
          patientSearchTerm: JSON.stringify({ firstName, lastName }),
        });
      } else {
        this.searchPatient.emit(this.patientSearchForm.value);
      }
    } else {
      this.toastr.error('Lütfen arama kriterini doğru girdiğinizden emin olunuz!');
    }
  }
}
