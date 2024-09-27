import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  // Import CommonModule

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,  // Add CommonModule here
    FormsModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']  // Fixed styleUrl to styleUrls
})
export class AdminDashboardComponent implements OnInit {
  products: any[] = [];
  newProduct: any = {};
  editingProduct: any = null;
  selectedImage: File | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  addProduct(): void {
    const formData = new FormData();
    formData.append('name', this.newProduct.name);
    formData.append('price', this.newProduct.price.toString());
    formData.append('seller', this.newProduct.seller);
    formData.append('description', this.newProduct.description);

    if (this.selectedImage) {
      formData.append('image', this.selectedImage, this.selectedImage.name);
    }

    this.productService.addProduct(formData).subscribe(() => {
      this.loadProducts(); // Reload products after adding
    });
  }

  removeProduct(id: number): void {
    this.productService.removeProduct(id).subscribe(() => {
      this.loadProducts();
    });
  }

  editProduct(product: any): void {
    this.editingProduct = { ...product }; // Copy product data to editingProduct
  }

  updateProduct(): void {
    if (this.editingProduct) {
      this.productService.addProduct(this.editingProduct).subscribe(() => {
        this.loadProducts();
        this.editingProduct = null; // Reset editing
      });
    }
  }

  toggleProductStatus(product: any): void {
    product.enabled = !product.enabled;
    this.productService.addProduct(product).subscribe(() => {
      this.loadProducts();
    });
  }
}
