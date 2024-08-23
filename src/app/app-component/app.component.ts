import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { RoutingHandlerService } from '../services/routing-handler.service';

@Component({
  selector: 'app-root',
  standalone: true, // Ensure this is set for standalone components
  imports: [RouterModule], // Import RouterModule for routing features like router-outlet
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'demo';

  constructor(private router: Router, private routingHandlerService : RoutingHandlerService) {}

  ngOnInit() {
    this.routingHandlerService.handleRouting("navigate-to-home")
  }

 
}
