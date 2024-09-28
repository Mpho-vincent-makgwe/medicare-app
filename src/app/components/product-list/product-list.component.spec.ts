import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['addToCart']);

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: ProductService, useValue: productServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]  // Ignore errors related to child components
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch products and update the products list', () => {
    const mockProducts = [
      { id: 1, name: 'Product 1', description: 'Description 1', price: 10, category: 'Category 1', image_url: 'url1' },
      { id: 2, name: 'Product 2', description: 'Description 2', price: 20, category: 'Category 2', image_url: 'url2' }
    ];
    
    component.onProductsFetched(mockProducts);
    
    expect(component.products).toEqual(mockProducts);
  });

  it('should call addToCart on ProductService when a product is added to the cart', () => {
    const mockProductId = 1;
    const mockResponse = { success: true };
    
    productService.addToCart.and.returnValue(of(mockResponse));

    spyOn(window, 'alert');  // Spy on the alert function

    component.addToCart(mockProductId);

    expect(productService.addToCart).toHaveBeenCalledWith(mockProductId, 1);
    expect(window.alert).toHaveBeenCalledWith('Product added to cart successfully!');
  });

  it('should handle error when adding a product to the cart', () => {
    const mockProductId = 2;
    const mockError = { message: 'Error adding product to cart' };
    
    productService.addToCart.and.returnValue(throwError(mockError));

    spyOn(window, 'alert');  // Spy on the alert function
    spyOn(console, 'error');  // Spy on the console error function

    component.addToCart(mockProductId);

    expect(productService.addToCart).toHaveBeenCalledWith(mockProductId, 1);
    expect(window.alert).toHaveBeenCalledWith('Failed to add product to cart');
    expect(console.error).toHaveBeenCalledWith('Error adding product to cart:', mockError);
  });
});
