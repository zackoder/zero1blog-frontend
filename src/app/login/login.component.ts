// login.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],  // ✅ Fixed: Removed HttpClient
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  // Form data
  data = {
    email: '',
    password: '',
  };

  // Password validation state
  passwordValidation = {
    hasLowerCase: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasMinLength: false,
  };

  // Loading and error states
  isLoading = false;
  errorMessage = '';

  // ✅ Inject HttpClient properly
  constructor(private http: HttpClient) {}

  // Handle form submission
  onLogin() {
    // Clear previous errors
    this.errorMessage = '';

    // Validate before submitting
    if (!this.isFormValid()) {
      this.errorMessage = 'Please fill in all fields correctly';
      return;
    }

    // Show loading state
    this.isLoading = true;

    // Make API call
    this.http.post('http://localhost:8080/api/login', this.data)
      .subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.isLoading = false;
          // TODO: Save token, redirect to dashboard, etc.
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.errorMessage = 'Login failed. Please check your credentials.';
          this.isLoading = false;
        }
      });
  }

  // Handle password changes
  onPasswordChange(value: string) {
    this.data.password = value;
    this.validatePassword(value);
  }

  // Validate password requirements
  validatePassword(password: string) {
    this.passwordValidation.hasLowerCase = /[a-z]/.test(password);
    this.passwordValidation.hasUpperCase = /[A-Z]/.test(password);
    this.passwordValidation.hasNumber = /[0-9]/.test(password);
    this.passwordValidation.hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    this.passwordValidation.hasMinLength = password.length >= 8;
  }

  // Check if password meets all requirements
  isPasswordValid(): boolean {
    return (
      this.passwordValidation.hasLowerCase &&
      this.passwordValidation.hasUpperCase &&
      this.passwordValidation.hasNumber &&
      this.passwordValidation.hasSpecialChar &&
      this.passwordValidation.hasMinLength
    );
  }

  // Check if entire form is valid
  isFormValid(): boolean {
    return (
      this.data.email.trim() !== '' &&
      this.data.password.trim() !== '' &&
      this.isPasswordValid()
    );
  }
}