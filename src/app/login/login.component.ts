import { Component } from '@angular/core';
import { Router , RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service'; // Import the AuthService
import { ToastrService } from 'ngx-toastr'; // Import ToastrService for notifications

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private authService: AuthService, // Inject AuthService
    private toastr: ToastrService // Inject ToastrService for notifications
  ) {}

  onSubmit() {
    if (!this.username || !this.password) {
      this.toastr.warning('Kullanıcı adı ve Şifre gereklidir.');
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: (success) => {
        if (success) {
          this.toastr.success('Giriş Başarılı!');
          this.router.navigate(['/home']);
        } else {
          this.toastr.error('Giriş başarısız! Lütfen bilgilerinizi kontrol ediniz.');
        }
      },
      error: (err) => {
        this.toastr.error('Giriş başarısız. Tekrat deneyiniz.');
        console.error('Login error:', err);
      }
    });
  }
}
