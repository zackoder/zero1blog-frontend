import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  data = {
    email: '',
    password: '',
  };

  passwordValidation = {
    hasLowerCase: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasMinLength: false,
  };

  isLoading = false;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  onLogin() {
    this.errorMessage = '';

    if (!this.isFormValid()) {
      this.errorMessage = 'Please fill in all fields correctly';
      return;
    }

    this.isLoading = true;

    this.http.post('http://localhost:8080/api/login', this.data)
      .subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.errorMessage = 'Login failed. Please check your credentials.';
          this.isLoading = false;
        }
      });
  }

  onPasswordChange(value: string) {
    this.data.password = value;
    this.validatePassword(value);
  }

  validatePassword(password: string) {
    this.passwordValidation.hasLowerCase = /[a-z]/.test(password);
    this.passwordValidation.hasUpperCase = /[A-Z]/.test(password);
    this.passwordValidation.hasNumber = /[0-9]/.test(password);
    this.passwordValidation.hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    this.passwordValidation.hasMinLength = password.length >= 8;
  }

  isPasswordValid(): boolean {
    return (
      this.passwordValidation.hasLowerCase &&
      this.passwordValidation.hasUpperCase &&
      this.passwordValidation.hasNumber &&
      this.passwordValidation.hasSpecialChar &&
      this.passwordValidation.hasMinLength
    );
  }

  isFormValid(): boolean {
    return (
      this.data.email.trim() !== '' &&
      this.data.password.trim() !== '' &&
      this.isPasswordValid()
    );
  }
}