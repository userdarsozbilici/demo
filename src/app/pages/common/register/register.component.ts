import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, DropdownModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  role: string = ''; 

  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  roles = [
    { label: 'Kabul Birimi', value: 'admission' },
    { label: 'Kayıt Birimi', value: 'registration' },
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
  ) {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      this.toastr.error('Tüm alanları doldurun ve şifre gereksinimlerini karşılayın.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.toastr.error('Şifreler uyuşmuyor.');
      return;
    }

    this.authService.register(this.username, this.password, this.role).subscribe({
      next: () => {
        this.toastr.success(
          `'${this.username}' kullanıcı başarıyla sisteme kaydedildi. Lütfen giriş yapın.`,
        );
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toastr.error('Kayıt başarısız. Lütfen tekrar deneyin.');
        console.error('Registration failed:', err);
      },
    });
  }
}
