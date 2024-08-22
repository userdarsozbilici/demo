import { Component, Input, OnInit } from '@angular/core'
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { DropdownModule } from 'primeng/dropdown' // PrimeNG dropdown module
import { ComboBoxService } from '../../services/combo-box.service'

@Component({
  selector: 'app-combo-box',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DropdownModule],
  templateUrl: './combo-box.component.html',
  styleUrls: ['./combo-box.component.css'],
})
export class ComboBoxComponent implements OnInit {
  @Input() formGroup!: FormGroup
  @Input() cityControlName!: string
  @Input() countyControlName!: string

  cities: any[] = []
  counties: any[] = []

  constructor(private comboBoxService: ComboBoxService) {}

  ngOnInit(): void {
    this.loadCities()
    this.formGroup
      .get(this.cityControlName)
      ?.valueChanges.subscribe((cityId) => {
        if (cityId) {
          this.loadCounties(cityId)
        } else {
          this.counties = []
          this.formGroup.get(this.countyControlName)?.reset()
        }
      })
  }

  get cityControl(): FormControl {
    return this.formGroup.get(this.cityControlName) as FormControl
  }

  get countyControl(): FormControl {
    return this.formGroup.get(this.countyControlName) as FormControl
  }

  loadCities() {
    this.comboBoxService.getCities().subscribe(
      (cities) => {
        this.cities = cities
      },
      (error) => {
        console.error('Error loading cities', error)
      },
    )
  }

  loadCounties(cityId: number) {
    this.comboBoxService.getCounties(cityId).subscribe(
      (counties) => {
        this.counties = counties
        this.countyControl.reset()
      },
      (error) => {
        console.error('Error loading counties', error)
      },
    )
  }
}
