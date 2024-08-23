import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-policlinic-home',
  templateUrl: './policlinic-home.component.html',
  styleUrls: ['./policlinic-home.component.css'],
})
export class PoliclinicHomeComponent {
  constructor(private router: Router, private authService: AuthService) {}

  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);
  }

  logout() {
    this.authService.logout();
  }
}
