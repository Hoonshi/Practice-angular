import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  signupForm = new FormGroup({
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
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    const { email, password } = this.signupForm.value;

    // signup은 post => observable 반환. 그리고 subscribe는 observable을 구독해서 결과를 처리.
    this.authService.signup(email!, password!).subscribe(
      (response) => {
        this.authService.saveToken(response.token);
        this.router.navigate(['/todo']);
      },
      (error) => {
        console.error('Signup failed:', error);
      },
    );
  }
}
