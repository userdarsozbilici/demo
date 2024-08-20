import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { AuthService } from '../services/auth.service'
@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
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
