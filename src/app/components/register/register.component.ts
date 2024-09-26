import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  fullName: string = '';
  email: string = '';
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient) {}

  register() {
    const user = {
      fullName: this.fullName,
      email: this.email,
      username: this.username,
      password: this.password
    };

    this.http.post('http://localhost:3000/api/register', user).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        alert('Registration successful!');
        // Redirect or take further actions
      },
      error: (error) => {
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');
      }
    });
  }
}
