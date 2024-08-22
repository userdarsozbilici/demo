import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoutingHandlerService {

  constructor(private router: Router) {}

  handleRouting(fromPage: string) {
    const role = localStorage.getItem('role');

    switch (fromPage) {
      case 'login':
        this.handleLoginRedirect(role);
        break;
      case 'navigate-to-home':
        this.handleHomeRedirect(role);
        break;
      default:
        console.warn(`No routing rule defined for fromPage: ${fromPage}`);
    }
  }

  private handleLoginRedirect(role: string | null) {
    if (!role) {
      console.error('Role not found in localStorage');
      this.router.navigate(['/login']); 
      return;
    }

    switch (role) {
      case 'admission':
        this.router.navigate(['/admission-home']);
        break;
      case 'registration':
        this.router.navigate(['/registration-home']);
        break;
      default:
        console.warn(`No redirect rule defined for role: ${role}`);
        this.router.navigate(['/login']); 
    }
  }

  private handleHomeRedirect(role: string | null) {
    if (!role) {
      console.error('Role not found in localStorage');
      this.router.navigate(['/login']); 
      return;
    }

    switch (role) {
      case 'admission':
        this.router.navigate(['/admission-home']);
        break;
      case 'registration':
        this.router.navigate(['/registration-home']);
        break;
      default:
        console.warn(`No redirect rule defined for role: ${role}`);
        this.router.navigate(['/login']); 
    }
  }
}
