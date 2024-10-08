import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { RoutingHandlerService } from '../../services/routing-handler.service'
@Component({
  selector: 'app-navigate-home-button',
  standalone: true,
  imports: [],
  templateUrl: './navigate-home-button.component.html',
  styleUrl: './navigate-home-button.component.css',
})
export class NavigateHomeButtonComponent {
  constructor(private router: Router, private routingHandler : RoutingHandlerService) {}

  navigateToHome() {
    this.routingHandler.handleRouting("navigate-to-home")
  }
}
