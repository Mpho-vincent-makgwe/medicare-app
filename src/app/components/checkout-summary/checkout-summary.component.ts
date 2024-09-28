import { Component } from '@angular/core';
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
  selector: 'app-checkout-summary',
  standalone: true,
  imports: [],
  templateUrl: './checkout-summary.component.html',
  styleUrls: ['./checkout-summary.component.css']
})
export class CheckoutSummaryComponent {
  order: Order | undefined; // Store the order details

  constructor(private router: Router) {
    // Retrieve order details passed from the previous component
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.order = navigation.extras.state['order'];
    }
  }

  calculateTotalPrice(): string {
    let total = 0;
    if (this.order?.items) {
      this.order.items.forEach(item => {
        total += item.price * item.quantity;
      });
    }
    return total.toFixed(2);
  }
}
