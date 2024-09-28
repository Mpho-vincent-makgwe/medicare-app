import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private orderDetails: Order | undefined;
  
  constructor(private http: HttpClient) {}

  setOrderDetails(order: Order) {
    this.orderDetails = order;
  }

  getOrderDetails(): Order | undefined {
    return this.orderDetails;
  }
}
