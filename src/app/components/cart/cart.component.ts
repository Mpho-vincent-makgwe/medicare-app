import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartItems$: Observable<any[]> = of([]);   // Observable to store cart items
  loading: boolean = true;                  // Loading indicator
  error: string | null = null;              // Error handling
  hasCartItems: boolean = false;

  constructor(private http: HttpClient) {
    this.getCartItems();
  }

  // Fetch all cart items
  getCartItems() {
    this.loading = true;
    this.error = null;

    this.http.get<any[]>('/api/cart')  // API endpoint to get cart items
      .pipe(
        catchError((error) => {
          console.error('Error fetching cart items:', error);
          this.error = 'Failed to load cart items';
          this.loading = false;
          return of([]); // Handle error by returning an empty observable
        })
      )
      .subscribe((data) => {
        this.cartItems$ = of(data); // Store fetched cart items
        this.hasCartItems = data.length > 0; // Determine if there are cart items
        this.loading = false; // Loading is complete
      });
  }

  // Function to delete a cart item
  deleteCartItem(cartItemId: number) {
    this.http.delete(`/api/cart/item/${cartItemId}`)
      .subscribe(() => {
        // Refresh cart items after deletion
        this.getCartItems();
      }, (error) => {
        console.error('Error deleting cart item:', error);
        this.error = 'Failed to delete cart item';
      });
  }
}
