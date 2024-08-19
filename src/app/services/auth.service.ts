import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { catchError, map , switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8082/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      map((response) => {
        if (response.success) {
          this.setTokens(response.accessToken, response.refreshToken);
          return true;
        } else {
          //this.toastr.error(response.message || 'Login failed. Please try again.');
          return false;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        //this.toastr.error('Login failed. Please try again.');
        return of(false); // Return false to indicate login failure
      })
    );
  }

  register(username: string, password: string): Observable<void> {
    return this.http.post<any>(`${this.apiUrl}/register`, { username, password }).pipe(
      map((response) => {
        if (response.success) {
          this.router.navigate(['/login']);
        } else {
          //this.toastr.error(response.message || 'Registration failed. Please try again.');
        }
      }),
      catchError((error: HttpErrorResponse) => {
        
        return of(); // Return an empty observable to terminate the error stream
      })
    );
  }

  validateAccessToken(): Observable<boolean> {
    const accessToken = this.getToken();
    return this.http.post<any>(`${this.apiUrl}/validate-access-token`, { accessToken }).pipe(
      map((response) => response.valid),
      catchError(() => of(false))
    );
  }

  getAccessTokenByRefreshToken(): Observable<void> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<any>(`${this.apiUrl}/get-access-token-by-refresh-token`, { refreshToken }).pipe(
      map((response) => {
        this.setTokens(response.accessToken, response.refreshToken);
      }),
      catchError(() => {
        this.logout();
        this.router.navigate(['/login']);
        this.toastr.error('Oturumunuz sonlanmıştır. Lütfen tekrardan giriş yapınız!');
        return of();
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }
  

  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  logout(): void {
    this.clearTokens();
    this.router.navigate(['/login']);
    this.toastr.info('Oturumunuz Sonlanmıştır.');
  }

  isAuthenticated(): Observable<boolean> {
    return this.validateAccessToken().pipe(
      switchMap((valid) => {
        if (!valid) {
          return this.getAccessTokenByRefreshToken().pipe(
            map(() => true),
            catchError(() => {
              this.router.navigate(['/login']);
              this.toastr.error('Oturumunuz sonlanmıştır. Lütfen tekrardan giriş yapınız!');
              return of(false);
            })
          );
        }
        return of(true);
      }),
      catchError(() => {
        this.router.navigate(['/login']);
        this.toastr.error('Oturumunuz sonlanmıştır. Lütfen tekrardan giriş yapınız!');
        return of(false);
      })
    );
  }
  
}
