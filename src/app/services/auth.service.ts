import { Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { identity, Observable, of } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8082/api/auth'

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  login(username: string, password: string): Observable<boolean> {
    const headers = {
      'X-Username': username,
      'X-Password': password,
    }

    return this.http
      .post<any>(`${this.apiUrl}/login`, null, { headers })
      .pipe(
        map((response) => {
          if (response.success) {
            this.setTokens(response.accessToken, response.refreshToken);
            this.setRole(response.role);
            this.setUserId(response.id);

            if (response.role === 'policlinic' && response.policlinicId) {
              this.setPoliclinicId(response.policlinicId);
            }

            return true;
          } else {
            return false;
          }
        }),
        catchError((error: HttpErrorResponse) => {
          return of(false);
        }),
      );
  }


  register(username: string, password: string, role: string, policlinicId?: number): Observable<void> {
    const headers = {
      'X-Username': username,
      'X-Password': password,
      'X-Role': role,
      'X-Policlinic-Id': policlinicId ? policlinicId.toString() : '' // Add the policlinicId to headers if it exists
    };

    console.log("registerr")
  
    return this.http
      .post<any>(`${this.apiUrl}/register`, null, { headers })
      .pipe(
        map((response) => {
          if (response.success) {
            this.router.navigate(['/login']);
          } else {
            console.error("Registration failed:", response.message);
          }
        }),
        catchError((error: HttpErrorResponse) => {
          console.error("HTTP Error:", error);
          return of();
        }),
      );
  }
  

  validateAccessToken(): Observable<boolean> {
    const accessToken = this.getToken()
    return this.http
      .post<any>(`${this.apiUrl}/validate-access-token`, { accessToken })
      .pipe(
        map((response) => response.valid),
        catchError(() => of(false)),
      )
  }

  getAccessTokenByRefreshToken(): Observable<void> {
    const refreshToken = this.getRefreshToken()
    return this.http
      .post<any>(`${this.apiUrl}/get-access-token-by-refresh-token`, {
        refreshToken,
      })
      .pipe(
        map((response) => {
          this.setTokens(response.accessToken, response.refreshToken)
        }),
        catchError(() => {
          this.logout()
          this.router.navigate(['/login'])
          this.toastr.error(
            'Oturumunuz sonlanmıştır. Lütfen tekrardan giriş yapınız!',
          )
          return of()
        }),
      )
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken')
  }

  getRole(): string | null {
    return localStorage.getItem("role")
  }

  getUserId(): number | null {
    const userId = localStorage.getItem("userId");
    return userId ? parseInt(userId, 10) : null;
  }
  

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken')
  }

  setRole(role:string): void {
    localStorage.setItem("role", role)
  } 

  setUserId(userId: number): void {
    localStorage.setItem("userId", userId.toString());
  }
  
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  }

  clearTokens(): void {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  clearUserInfos(){
    this.clearRole()
    this.clearUserId()
    this.clearPoliclinicId()
  }

  clearUserId(){
    localStorage.removeItem("userId")
  }

  clearRole(): void {
    localStorage.removeItem("role")
  }

  getPoliclinicId(): number | null {
    const policlinicId = localStorage.getItem("policlinicId");
    return policlinicId ? parseInt(policlinicId, 10) : null;
  }
  
  setPoliclinicId(policlinicId: number): void {
    localStorage.setItem("policlinicId", policlinicId.toString());
  }
  
  clearPoliclinicId(): void {
    localStorage.removeItem("policlinicId");
  }
  

  logout(): void {
    const username = this.getUsernameFromToken()
    if (!username) {
      this.toastr.error('Çıkış işlemi sırasında bir hata oluştu.')
      return
    }

    const headers = {
      'X-Username': username,
    }

    this.http.post(`${this.apiUrl}/logout`, null, { headers }).subscribe({
      next: () => {
        this.clearTokens()
        this.clearUserInfos()
        this.router.navigate(['/login'])
        this.toastr.info('Oturumunuz Sonlanmıştır.')
      },
      error: (err) => {
        this.toastr.error('Çıkış işlemi sırasında bir hata oluştu.')
        console.error('Logout error:', err)
      },
    })
  }

  isAuthenticated(): Observable<boolean> {
    return this.validateAccessToken().pipe(
      switchMap((valid) => {
        if (!valid) {
          return this.getAccessTokenByRefreshToken().pipe(
            map(() => true),
            catchError(() => {
              this.router.navigate(['/login'])
              this.toastr.error(
                'Oturumunuz sonlanmıştır. Lütfen tekrardan giriş yapınız!',
              )
              return of(false)
            }),
          )
        }
        return of(true)
      }),
      catchError(() => {
        this.router.navigate(['/login'])
        this.toastr.error(
          'Oturumunuz sonlanmıştır. Lütfen tekrardan giriş yapınız!',
        )
        return of(false)
      }),
    )
  }

  parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          })
          .join(''),
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error('Error parsing JWT token', error)
      return null
    }
  }

  getUsernameFromToken(): string | null {
    const token = this.getToken()
    console.log(token)
    if (token) {
      console.log("ifff")
      const decoded = this.parseJwt(token)
      console.log(decoded)
      return decoded ? decoded.sub : null
    }
    return null
  }
}
