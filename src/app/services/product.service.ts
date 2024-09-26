import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  getProducts() {
    // Ideally, you'd fetch this from the backend. Placeholder for now.
    return [
      { id: 1, name: 'Paracetamol', price: 10 },
      { id: 2, name: 'Ibuprofen', price: 15 }
    ];
  }

  getProductById(id: number) {
    return this.getProducts().find(product => product.id === id);
  }
}
