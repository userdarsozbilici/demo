import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  showHastaIslemleri = false;

  constructor(private router: Router) {}

  toggleSection(section: string) {
    if (section === 'hastaIslemleri') {
      this.showHastaIslemleri = true;
    } else if (section === 'main') {
      this.showHastaIslemleri = false;
    }
  }

  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);
  }
}
