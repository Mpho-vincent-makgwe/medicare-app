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

  constructor(private http: HttpClient) {}

  submitOrder(order: Order): Observable<any> {
    return this.http.post('/api/orders', order); // Adjust your API endpoint here
  }
}
