import { Component } from '@angular/core';
import { Router , RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  onSubmit() {
    if (!this.username || !this.password || !this.confirmPassword) {
      this.toastr.error('Tüm alanları doldurun.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.toastr.error('Şifreler uyuşmuyor.');
      return;
    }

    this.authService.register(this.username, this.password).subscribe({
      next: () => {
        this.toastr.success(`'${this.username}' kullanıcı başarıyla sisteme kaydedildi. Lütfen giriş yapın.`);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toastr.error('Kayıt başarısız. Lütfen tekrar deneyin.');
        console.error('Registration failed:', err);
      },
    });
  }
}
