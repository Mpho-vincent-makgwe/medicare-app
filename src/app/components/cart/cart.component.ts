import { Component, OnInit } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart-service.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  // Explicitly specify the type of BehaviorSubject
  cartItems$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]); // Type is now any[]
  loading: boolean = true;
  error: string | null = null;
  hasCartItems: boolean = false;
  totalPrice: number = 0;


  constructor(private cartService: CartService, private router: Router) {}

  // Method to calculate the total price of the cart
  calculateTotalPrice() {
    let total = 0;
    this.cartItems$.subscribe(items => {
      items.forEach(item => {
        total += item.price * item.quantity;
      });
    });
    return total.toFixed(2); // Return with 2 decimal places
  }

  ngOnInit(): void {
    this.getCartItems();
  }
  goToCheckout() {
    this.router.navigate(['/checkout']); // Adjust the path as needed
  }
  getCartItems() {
    this.loading = true;
    this.error = null;

    this.cartService.getCartItems().subscribe((data) => {
      this.cartItems$.next(data);
      this.hasCartItems = data.length > 0;
      this.loading = false;
    }, (error) => {
      console.error('Error fetching cart items:', error); // Log the error response
      this.error = 'Failed to load cart items';
      this.loading = false;
    });

  }
 // Method to update quantity of a product in the cart
 updateCartItem(productId: number, quantity: number) {
  this.cartService.addToCart(productId, quantity).subscribe(
    (response) => {
      console.log('Quantity updated in cart:', response);
      alert('Quantity updated successfully!');
    },
    (error) => {
      console.error('Error updating quantity in cart:', error);
      alert('Failed to update quantity');
    }
  );
}

  deleteCartItem(cartItemId: number) {
    this.cartService.deleteCartItem(cartItemId).subscribe(() => {
      this.getCartItems(); // Refresh cart items after deletion
    }, (error) => {
      console.error('Error deleting cart item:', error);
      this.error = 'Failed to delete cart item';
    });
  }
}
