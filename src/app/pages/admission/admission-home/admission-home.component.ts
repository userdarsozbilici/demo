import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-admission-home',
  templateUrl: './admission-home.component.html',
  styleUrls: ['./admission-home.component.css'],
})
export class AdmissionHomeComponent {
  constructor(private router: Router, private authService: AuthService) {}

  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);
  }

  logout() {
    this.authService.logout();
  }
}
