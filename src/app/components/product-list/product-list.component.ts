import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { FetchComponent } from '../fetch/fetch.component';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FetchComponent,
    ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent  {
  // products: any[] = [];
  @Input() products: any[] = [];

  constructor(private productService: ProductService) {}

onProductsFetched(products: any[]): void {
  this.products = products;
}


addToCart(productId: number) {
  const quantity = 1; // Default quantity; you can modify this logic as needed
  this.productService.addToCart(productId, quantity).subscribe(
    (response) => {
      console.log('Product added to cart:', response);
      alert('Product added to cart successfully!');
    },
    (error) => {
      console.error('Error adding product to cart:', error);
      alert('Failed to add product to cart');
    }
  );
}



}
