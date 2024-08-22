import { Component } from '@angular/core'
import { Router, RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { AuthService } from '../../../services/auth.service'
import { ToastrService } from 'ngx-toastr'
import { RoutingHandlerService } from '../../../services/routing-handler.service'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = ''
  password: string = ''

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private routingHandlerService: RoutingHandlerService
  ) {}

  onSubmit() {
    if (!this.username || !this.password) {
      this.toastr.error('Kullanıcı adı ve Şifre gereklidir.')
      return
    }

    this.authService.login(this.username, this.password).subscribe({
      next: (success) => {
        if (success) {
          this.toastr.success(
            `'${this.username}' kullanıcısı ile sisteme giriş yapıldı.`,
          )
          this.routingHandlerService.handleRouting("login")
        } else {
          this.toastr.error(
            'Giriş başarısız! Lütfen bilgilerinizi kontrol ediniz.',
          )
        }
      },
      error: (err) => {
        this.toastr.error('Giriş başarısız. Tekrat deneyiniz.')
        console.error('Login error:', err)
      },
    })
  }
}
