import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  cartItemCount: number = 0; // Define cartItemCount

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    // this.getCartItemCount(); // Call the function to get the cart count
  }

  // getCartItemCount() {
  //   this.http.get<any[]>('/api/cart').subscribe(
  //     (data: any[]) => {
  //       this.cartItemCount = data.length;  // Update cart item count
  //     },
  //     (error) => {
  //       console.error('Error fetching cart item count', error);
  //     }
  //   );
  // }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
