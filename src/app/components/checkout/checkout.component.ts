import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart-service.service';
import { CheckoutService } from '../../services/checkout.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'; // Import Router

interface Order {
  shipping: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
  };
  payment: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
  items: any[];
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'] // Fixed typo from styleUrl to styleUrls
})
export class CheckoutComponent {
  totalPrice: number = 0;
  cartItems$: Observable<any[]> | undefined;

  checkoutDetails = {
    fullName: '',
    address: '',
    city: '',
    postalCode: ''
  };

  paymentDetails = {
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  };

  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private http: HttpClient,
    private router: Router // Inject Router
  ) {}

  onCheckout() {
    const order: Order = {
      shipping: this.checkoutDetails,
      payment: this.paymentDetails,
      items: [] // Populate with cart items
    };

    // Fetch cart items from the service
    this.cartService.getCartItems().subscribe(cartItems => {
      order.items = cartItems; // Assign cart items to the order

      // Use the CheckoutService to submit the order
      this.checkoutService.submitOrder(order).subscribe(
        response => {
          console.log('Order submitted successfully:', response);
          // Navigate to checkout summary page on success
          this.router.navigate(['/checkout-summary']);
        },
        error => {
          console.error('Error submitting order:', error);
          // Handle error response
        }
      );
    });
  }

  calculateTotalPrice() {
    let total = 0;

    if (this.cartItems$) {
      this.cartItems$.subscribe(items => {
        items.forEach(item => {
          total += item.price * item.quantity;
        });
      });
    }

    return total.toFixed(2); // Return with 2 decimal places
  }
}
