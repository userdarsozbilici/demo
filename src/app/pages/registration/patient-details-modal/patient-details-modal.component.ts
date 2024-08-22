import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core'
import { Patient } from '../../../models/patient.model'
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms'
import { CommonModule } from '@angular/common'
import { DialogModule } from 'primeng/dialog'
import { ButtonModule } from 'primeng/button'
import { FormsModule } from '@angular/forms'
import { ComboBoxService } from '../../../services/combo-box.service'
import { ComboBoxComponent } from '../../../common-components/combo-box/combo-box.component'
@Component({
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    ComboBoxComponent,
  ],
  selector: 'app-patient-details-modal',
  templateUrl: './patient-details-modal.component.html',
  styleUrls: ['../patients-table/patients-table.component.css'],
})
export class PatientDetailsModalComponent implements OnInit, OnChanges {
  @Input() displayModal = false
  @Input() selectedPatient: Patient | null = null
  @Input() isEditMode = false
  @Output() closeModal = new EventEmitter<void>()
  @Output() savePatient = new EventEmitter<void>()
  @Output() enableEditMode = new EventEmitter<void>()
  @Output() deletePatient = new EventEmitter<void>()
  @Output() disableEditMode = new EventEmitter<void>()

  formGroup!: FormGroup
  cities: any[] = []
  counties: any[] = []

  constructor(private comboBoxService: ComboBoxService) {}

  ngOnInit(): void {
    this.initializeFormGroup()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedPatient'] && this.selectedPatient) {
      this.initializeFormGroup()
      this.loadCityAndCounty()
    }
  }

  initializeFormGroup(): void {
    this.formGroup = new FormGroup({
      residenceCity: new FormControl(null, Validators.required),
      residenceCounty: new FormControl(null, Validators.required),
    })

    this.formGroup.get('residenceCity')?.valueChanges.subscribe((cityId) => {
      if (cityId) {
        this.loadCounties(cityId)
      } else {
        this.counties = []
        this.formGroup.get('residenceCounty')?.reset()
      }
    })
  }

  loadCityAndCounty(): void {
    if (this.selectedPatient) {
      this.comboBoxService
        .getCityIdByCountyId(this.selectedPatient.residence)
        .subscribe((cityId) => {
          this.formGroup.patchValue({
            residenceCity: cityId,
            residenceCounty: this.selectedPatient!.residence,
          })
          this.loadCounties(cityId)
        })
    }
  }

  loadCounties(cityId: number): void {
    this.comboBoxService.getCounties(cityId).subscribe((counties) => {
      this.counties = counties
      if (this.selectedPatient) {
        this.formGroup.patchValue({
          residenceCounty: this.selectedPatient.residence,
        })
      }
    })
  }

  enableEdit() {
    this.isEditMode = true
    this.enableEditMode.emit()

    if (this.selectedPatient) {
      this.loadCityAndCounty()
    }
  }

  close() {
    this.closeModal.emit()
  }

  save() {
    if (this.selectedPatient) {
      this.selectedPatient.residence = this.formGroup.get(
        'residenceCounty',
      )?.value
    }
    this.savePatient.emit()
  }

  disableEdit() {
    this.isEditMode = false
    this.disableEditMode.emit()
  }

  delete() {
    this.deletePatient.emit()
  }
}
