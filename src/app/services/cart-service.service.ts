import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api/cart';
 // Define the API endpoint for cart

  constructor(private http: HttpClient) {}

  // Fetch all items in the cart
  getCartItems(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
        catchError((error) => {
            console.error('Error fetching cart items:', error);
            return of([]); // Return an empty array on error
        })
    );
}


  // Add an item to the cart
  // addCartItem(productId: number, quantity: number): Observable<any> {
  //   return this.http.post(this.apiUrl, { productId, quantity }).pipe(
  //     catchError((error) => {
  //       console.error('Error adding item to cart:', error);
  //       return of(null); // Return null on error
  //     })
  //   );
  // }
   // Method to add/update product in the cart
   addToCart(productId: number, quantity: number): Observable<any> {
    return this.http.post(this.apiUrl, { productId, quantity });
  }


  // Delete an item from the cart
  deleteCartItem(cartItemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/item/${cartItemId}`).pipe(
      catchError((error) => {
        console.error('Error deleting cart item:', error);
        return of(null); // Return null on error
      })
    );
  }
}
