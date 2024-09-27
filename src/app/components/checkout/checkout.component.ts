import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart-service.service';
import { HttpClient } from '@angular/common/http';

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
  styleUrl: './checkout.component.css'
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

  constructor(private cartService: CartService, private http: HttpClient) {}

  onCheckout() {
    const order: Order = {
        shipping: this.checkoutDetails,
        payment: this.paymentDetails,
        items: [] // Populate with cart items
    };

    // Fetch cart items from the service
    this.cartService.getCartItems().subscribe(cartItems => {
        order.items = cartItems; // Assign cart items to the order

        // Here you can send the order to your backend
        this.submitOrder(order);
    });
}

submitOrder(order: Order) {
  // Assuming you have an API endpoint to submit the order
  this.http.post('/api/orders', order).subscribe(
      response => {
          console.log('Order submitted successfully:', response);
          // Handle success response
      },
      error => {
          console.error('Error submitting order:', error);
          // Handle error response
      }
  );
}
}
