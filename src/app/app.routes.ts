import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';


import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
// import { NavbarComponent } from './components/navbar/navbar.component';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
];

@NgModule({
  declarations: [
    // LoginComponent,
    // RegisterComponent,
    // ProductListComponent,
    // ProductDetailComponent,
    // AdminDashboardComponent,
    // CartComponent
  ],
  imports: [
    // NavbarComponent,
    BrowserModule,
    RouterModule.forRoot(routes),
    // AppComponent  // Import the standalone component

  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
