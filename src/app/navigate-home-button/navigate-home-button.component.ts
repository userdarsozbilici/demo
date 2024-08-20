import { Component } from '@angular/core'
import { Router } from '@angular/router'
@Component({
  selector: 'app-navigate-home-button',
  standalone: true,
  imports: [],
  templateUrl: './navigate-home-button.component.html',
  styleUrl: './navigate-home-button.component.css',
})
export class NavigateHomeButtonComponent {
  constructor(private router: Router) {}

  navigateToHome() {
    this.router.navigate([`/home`])
  }
}
