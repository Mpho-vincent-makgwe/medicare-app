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
  selectedItem: any = null;                 // Selected cart item for detailed view
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

      this.http.get<any[]>('/api/cart/1')  // You can change this to `/api/cart` for all items
        .pipe(
          catchError((error) => {
            console.error('Error fetching cart items:', error);
            this.error = 'Failed to load cart items';
            this.loading = false;
            return of([]); // Handle error by returning an empty observable
          })
        )
        .subscribe((data) => {
          if (data && data.length > 0) {
            this.cartItems$ = of(data);
            this.hasCartItems = true;
          } else {
            this.hasCartItems = false;
          }
          this.loading = false;
        });
    }

  // Fetch details of a single cart item by ID
  getCartItemDetails(cartItemId: number) {
    this.loading = true;

    this.http.get<any>(`/api/cart/item/${cartItemId}`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching cart item details:', error);
          this.error = 'Failed to load item details';
          this.loading = false;
          return of(null);
        })
      )
      .subscribe((data) => {
        this.selectedItem = data;
        this.loading = false;
      });
  }

  // Function to delete a cart item
  deleteCartItem(cartItemId: number) {
    this.http.delete(`/api/cart/item/${cartItemId}`)
      .subscribe(() => {
        // Refresh cart items after deletion
        this.getCartItems();
        this.selectedItem = null;  // Clear the detailed view
      }, (error) => {
        console.error('Error deleting cart item:', error);
        this.error = 'Failed to delete cart item';
      });
  }
}
