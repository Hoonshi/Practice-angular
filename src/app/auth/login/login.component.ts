import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  constructor(
    private route: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    if (this.authService.getToken()) {
      this.route.navigate(['/todo']);
    }
  }

  onSubmit(): void {
    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        this.route.navigate(['/todo']);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }
}
