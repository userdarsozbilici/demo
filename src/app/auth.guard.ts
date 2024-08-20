import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { Observable, of } from 'rxjs'
import { AuthService } from './services/auth.service'
import { ToastrService } from 'ngx-toastr'
import { map, catchError } from 'rxjs/operators'
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      map((isAuthenticated) => {
        if (isAuthenticated) {
          return true
        } else {
          this.toastr.error('Lütfen giriş yapınız.')
          this.router.navigate(['/login'])
          return false
        }
      }),
      catchError(() => {
        this.toastr.error('Lütfen giriş yapınız.')
        this.router.navigate(['/login'])
        return of(false)
      }),
    )
  }
}
@Injectable({
  providedIn: 'root',
})
export class PreventAuthAccessGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      map((isAuthenticated) => {
        if (isAuthenticated) {
          this.toastr.info(
            'Sisteme zaten giriş yapılmış haldedir. Lütfen önce çıkış yapınız.',
          )
          this.router.navigate(['/home'])
          return false
        } else {
          return true
        }
      }),
      catchError(() => of(true)),
    )
  }
}
