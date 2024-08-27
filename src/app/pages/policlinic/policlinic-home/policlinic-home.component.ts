import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { PoliclinicService, Policlinic } from '../../../services/policlinic.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-policlinic-home',
  templateUrl: './policlinic-home.component.html',
  styleUrls: ['./policlinic-home.component.css'],
})
export class PoliclinicHomeComponent implements OnInit {
  policlinicName: string = '';

  constructor(
    private router: Router, 
    private authService: AuthService, 
    private policlinicService: PoliclinicService
  ) {}

  ngOnInit(): void {
    this.loadPoliclinicName();
  }

  loadPoliclinicName(): void {
    const policlinicId = localStorage.getItem('policlinicId');
    if (policlinicId) {
      this.policlinicService.getPoliclinicById(+policlinicId).subscribe({
        next: (policlinic: Policlinic) => {
          this.policlinicName = `${policlinic.name} Polikliniği`;
        },
        error: (err) => {
          console.error('Error fetching policlinic name:', err);
          this.policlinicName = 'Poliklinik';
        }
      });
    } else {
      this.policlinicName = 'Poliklinik';
    }
  }

  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);
  }

  logout() {
    this.authService.logout();
  }
}
