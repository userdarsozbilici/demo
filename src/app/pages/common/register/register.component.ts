import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { PoliclinicService, Policlinic } from '../../../services/policlinic.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, DropdownModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  role: string = ''; 
  selectedPoliclinicId: number | null = null;
  policlinics: Policlinic[] = [];

  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  roles = [
    { label: 'Kabul Birimi', value: 'admission' },
    { label: 'Kayıt Birimi', value: 'registration' },
    { label: 'Poliklinik', value: 'policlinic' }, // Added Poliklinik option
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private policlinicService: PoliclinicService, // Inject PoliclinicService
  ) {}

  ngOnInit(): void {
    this.loadPoliclinics();
  }

  loadPoliclinics(): void {
    this.policlinicService.getAllPoliclinics().subscribe({
      next: (data) => {
        this.policlinics = data;
      },
      error: (err) => {
        this.toastr.error('Poliklinikler yüklenemedi. Lütfen tekrar deneyin.');
        console.error('Failed to load policlinics:', err);
      },
    });
  }

  onSubmit(form: NgForm) {
    console.log("ssssss")
    if (!form.valid) {
      this.toastr.error('Tüm alanları doldurun ve şifre gereksinimlerini karşılayın.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.toastr.error('Şifreler uyuşmuyor.');
      return;
    }

    this.authService.register(this.username, this.password, this.role, this.selectedPoliclinicId || undefined).subscribe({
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
