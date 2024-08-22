import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { InputTextModule } from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown'
import { ButtonModule } from 'primeng/button'
import { PatientService } from '../../../services/patient.service'
import { Patient } from '../../../models/patient.model'
import { PhoneFormatterDirective } from '../../../directives/phone-formatter.directive'
import { ToastrService } from 'ngx-toastr'
import { ComboBoxComponent } from '../../../common-components/combo-box/combo-box.component'
import { Router } from '@angular/router'
import { NavigateHomeButtonComponent } from '../../../common-components/navigate-home-button/navigate-home-button.component'
@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    PhoneFormatterDirective,
    ComboBoxComponent,
    NavigateHomeButtonComponent,
  ],
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup
  genders!: any[]
  birthCounties!: any[]
  birthCities!: any[]
  residenceCounties!: any[]
  residenceCities!: any[]
  submitted = false

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      identityNumber: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', [Validators.required]],
      birthCounty: ['', Validators.required],
      birthCity: ['', Validators.required],
      residenceCounty: ['', Validators.required],
      residenceCity: ['', Validators.required],
      address: ['', Validators.required],
      gender: ['', Validators.required],
      mobilePhone: [
        '',
        [Validators.required, Validators.pattern(/^\(5\d{2}\) \d{3}-\d{4}$/)],
      ],
      officePhone: [''],
      homePhone: [''],
    })

    this.genders = [
      { label: 'Erkek', value: 'male' },
      { label: 'Kadın', value: 'female' },
    ]
  }

  onSubmit() {
    this.submitted = true
    this.registrationForm.markAllAsTouched()
    if (this.registrationForm.valid) {
      const formValue = this.registrationForm.value

      const patient: Patient = {
        identityNumber: formValue.identityNumber,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        birthDate: formValue.birthDate,
        birthPlace: formValue.birthCounty,
        residence: formValue.residenceCounty,
        address: formValue.address,
        gender: formValue.gender,
        phoneNumbers: [
          {
            mobilePhone: formValue.mobilePhone,
            officePhone: formValue.officePhone || '',
            homePhone: formValue.homePhone || '',
          },
        ],
      }

      this.patientService.createPatient(patient).subscribe({
        next: (response) => {
          this.toastr.success(
            `${patient.firstName} ${patient.lastName} sisteme başarıyla kaydedildi!`,
          )
          this.registrationForm.reset()
          this.submitted = false
        },
        error: (error) => console.error('Error creating patient', error),
      })
    } else {
      this.toastr.info(
        'Lütfen gerekli tüm kısımları tam girdiğinizden emin olun!',
      )
    }
  }
}
