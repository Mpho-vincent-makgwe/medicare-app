import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart-service.service';
import { CheckoutService } from '../../services/checkout.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

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
  items: OrderItem[];
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
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
    private router: Router
  ) {}

  onCheckout() {
    const order: Order = {
      shipping: this.checkoutDetails,
      payment: this.paymentDetails,
      items: []
    };

    // Fetch cart items from the service
    this.cartService.getCartItems().subscribe(cartItems => {
      order.items = cartItems; // Assign cart items to the order

      // Save order details using the CheckoutService (if needed)
      this.checkoutService.setOrderDetails(order);

      // Directly navigate to the summary component with order details
      this.router.navigate(['/checkout-summary'], { state: { order: order } });
    });
  }

  calculateTotalPrice(): string {
    let total = 0;

    // Fetch cart items to calculate the total price
    this.cartService.getCartItems().subscribe(items => {
      items.forEach(item => {
        total += item.price * item.quantity;
      });
    });

    return total.toFixed(2); // Return total with 2 decimal places
  }
}
