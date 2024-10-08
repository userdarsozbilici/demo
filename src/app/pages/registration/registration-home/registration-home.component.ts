import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { AuthService } from '../../../services/auth.service'

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-registration-home',
  templateUrl: './registration-home.component.html',
  styleUrls: ['./registration-home.component.css'],
})
export class RegistrationHomeComponent {
  showHastaIslemleri = false
  constructor(private router: Router, private authService: AuthService) {}

  toggleSection(section: string) {
    if (section === 'hastaIslemleri') {
      this.showHastaIslemleri = true
    } else if (section === 'main') {
      this.showHastaIslemleri = false
      console.log(this.authService.getToken())
    }
  }

  navigateTo(page: string) {
    this.router.navigate([`/${page}`])
  }

  logout() {
    this.authService.logout()
  }
}
