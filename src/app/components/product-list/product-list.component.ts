import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data: any[]) => {
      this.products = data;
    });
  }

// Method to handle adding product to the cart
// Method to handle adding product to the cart with user-defined quantity
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
