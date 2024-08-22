import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { InputTextModule } from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown'
import { ButtonModule } from 'primeng/button'
import { ToastrService } from 'ngx-toastr'
import { NavigateHomeButtonComponent } from '../../../common-components/navigate-home-button/navigate-home-button.component'
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
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  searchForm!: FormGroup
  @Output() search = new EventEmitter<{
    searchBy: string
    searchTerm: string
  }>()
  @Output() showAll = new EventEmitter<void>()

  searchOptions = [
    { label: 'TC Kimlik', value: 'identityNumber' },
    { label: 'Hasta No', value: 'id' },
    { label: 'Ad Soyad', value: 'nameSurname' },
  ]
  selectedPlaceholder = 'TC Kimlik'

  constructor(private fb: FormBuilder, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      searchBy: ['identityNumber', Validators.required],
      searchTerm: ['', Validators.required],
    })
  }

  onSearchByChange(event: any) {
    const selectedValue = event.value
    switch (selectedValue) {
      case 'identityNumber':
        this.selectedPlaceholder = 'TC Kimlik'
        break
      case 'id':
        this.selectedPlaceholder = 'Hasta No'
        break
      case 'nameSurname':
        this.selectedPlaceholder = 'Ad Soyad'
        break
    }
    this.searchForm.get('searchTerm')?.setValue('')
  }

  onSearch() {
    if (this.searchForm.valid) {
      const searchBy = this.searchForm.get('searchBy')?.value
      const searchTerm = this.searchForm.get('searchTerm')?.value
      if (searchBy === 'nameSurname') {
        const [firstName, lastName] = searchTerm.split(' ')
        this.search.emit({
          searchBy: 'nameSurname',
          searchTerm: JSON.stringify({ firstName, lastName }),
        })
      } else {
        this.search.emit(this.searchForm.value)
      }
    } else {
      this.toastr.error(
        'Lütfen arama kriterini doğru girdiğinizden emin olunuz!',
      )
    }
  }

  showAllPatients() {
    this.showAll.emit()
  }
}
