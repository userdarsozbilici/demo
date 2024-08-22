import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SearchComponent } from '../search/search.component'
import { PatientsTableComponent } from '../patients-table/patients-table.component'
import { PatientService } from '../../../services/patient.service'
import { Patient } from '../../../models/patient.model'
import { ToastrService } from 'ngx-toastr'
import { NavigateHomeButtonComponent } from '../../../common-components/navigate-home-button/navigate-home-button.component'
import { ComboBoxService } from '../../../services/combo-box.service'
import { LoadingSpinnerComponent } from '../../../common-components/loading-spinner/loading-spinner.component'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SearchComponent,
    PatientsTableComponent,
    NavigateHomeButtonComponent,
    LoadingSpinnerComponent,
  ],
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class RegistrationMainPageComponent {
  patients: Patient[] = []
  searchPerformed = false
  loading = false

  constructor(
    private patientService: PatientService,
    private toastr: ToastrService,
    private comboBoxService: ComboBoxService,
  ) {}

  onSearch(searchCriteria: { searchBy: string; searchTerm: string }) {
    this.loading = true
    this.patientService
      .searchPatients(searchCriteria.searchBy, searchCriteria.searchTerm)
      .subscribe({
        next: (data) => {
          this.patients = data
          this.populateCityNames()
          this.searchPerformed = true
          this.loading = false
          if (this.patients.length === 0) {
            this.searchPerformed = false
            this.toastr.info('Verilen bilgilere uygun hasta bulunamadı')
          }
        },
        error: (err) => {
          this.loading = false
          console.error('Error fetching patient', err)
          this.toastr.error('Error fetching patient')
        },
      })
  }

  showAllPatients() {
    this.loading = true
    this.patientService.getAllPatients().subscribe({
      next: (data) => {
        this.patients = data
        this.populateCityNames()
        this.searchPerformed = true
        this.loading = false
        if (this.patients.length === 0) {
          this.searchPerformed = false
          this.toastr.info('No patients found')
        }
      },
      error: (err) => {
        this.loading = false
        console.error('Error fetching patients', err)
        this.toastr.error('Hasta bilgileri alınırken bir hata oluştu!')
      },
    })
  }

  resetSearch() {
    this.searchPerformed = false
  }

  populateCityNames() {
    this.patients.forEach((patient) => {
      this.getCityName(patient.birthPlace).then((cityName) => {
        patient.birthPlaceName = cityName
      })
      this.getCityName(patient.residence).then((cityName) => {
        patient.residenceName = cityName
      })
    })
  }

  getCityName(countyId: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.comboBoxService.getCityNameByCountyId(countyId).subscribe({
        next: (name: string) => {
          resolve(name)
        },
        error: (err) => {
          console.error('Error fetching city name', err)
          reject(err)
        },
      })
    })
  }
}
