import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fetch',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fetch.component.html',
  styleUrls: ['./fetch.component.css']
})
export class FetchComponent implements OnInit {
  @Output() productsFetched = new EventEmitter<any[]>();
  products: any[] = [];
  originalProducts: any[] = [];
  filterType: string = '';
  filter: string = '';
  sort: string = '';
  search: string = '';

  constructor(private productService: ProductService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.search = params['search'] || '';
      this.filterType = params['filterType'] || '';
      this.filter = params['filter'] || '';
      this.sort = params['sort'] || '';
      this.fetchProducts();
    });
  }

  // Fetch the products from the service
  fetchProducts(): void {
    this.productService.getProducts(this.search, this.filterType, this.filter, this.sort).subscribe((data: any[]) => {
      this.products = data;
      this.originalProducts = [...data];
      this.productsFetched.emit(this.products);
    }, error => {
      console.error('Error fetching products:', error);
    });
  }

  applySearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.search = target.value?.toLowerCase();
    this.updateURL();
    this.fetchProducts();
  }

  // applyFilterType(event: Event): void {
  //   const target = event.target as HTMLSelectElement;
  //   this.filterType = target.value;
  //   this.updateURL();
  //   this.fetchProducts();
  // }

  applySort(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.sort = target.value;
    this.updateURL();
    this.fetchProducts();
  }

  clearFilters(): void {
    this.search = '';
    this.filter = '';
    this.sort = '';
    this.filterType = '';
    this.updateURL();
    this.fetchProducts();
  }

  // Update the URL with current search, filter, and sort state
  private updateURL(): void {
    this.router.navigate([], {
      queryParams: {
        search: this.search,
        filterType: this.filterType,
        filter: this.filter,
        sort: this.sort
      },
      queryParamsHandling: 'merge' // Preserve other query parameters
    });
  }
}
