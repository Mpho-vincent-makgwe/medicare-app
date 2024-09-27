import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products';  // Backend URL
  private apiUrlCart = 'http://localhost:3000/api/cart';  // Backend URL

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addProduct(formData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }

  removeProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  addToCart(productId: number, quantity: number): Observable<any> {
    return this.http.post(this.apiUrlCart, { productId, quantity });
  }
}
