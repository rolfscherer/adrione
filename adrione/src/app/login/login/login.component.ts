import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';
import { AuthenticationRequest } from '../../core/auth/model/auth';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'adri-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isSubmitting = false;

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit(): void {
    const request: AuthenticationRequest = this.loginForm.getRawValue();
    this.isSubmitting = true;

    this.authService.login(request).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigateByUrl('/').then();
      },
      error: () => {
        this.isSubmitting = false;
      }
    });
  }
}
