import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  cartItems: any[] = [];
  userId: number = 1; // Get the logged-in user's ID appropriately

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getCartItems();
  }

  getCartItems() {
    this.http.get<any[]>(`/api/cart/${this.userId}`).subscribe(
      (data) => {
        this.cartItems = data;
      },
      (error) => {
        console.error('Error fetching cart items', error);
      }
    );
  }
}
