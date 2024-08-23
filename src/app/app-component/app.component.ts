import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { RouterModule } from '@angular/router';
import { RoutingHandlerService } from '../services/routing-handler.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'demo';

  constructor(
    private router: Router,
    private routingHandlerService: RoutingHandlerService
  ) {}

  ngOnInit() {
    // Subscribe to router events to check for route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: Event) => {
      // Type guard to ensure the event is of type NavigationEnd
      if (event instanceof NavigationEnd && (event.urlAfterRedirects === '/' || event.urlAfterRedirects === '')) {
        this.routingHandlerService.handleRouting("navigate-to-home");
      }
    });
  }
}
