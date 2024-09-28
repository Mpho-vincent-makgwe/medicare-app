import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-checkout-summary',
  standalone: true,
  imports: [],
  templateUrl: './checkout-summary.component.html',
  styleUrls: ['./checkout-summary.component.css']
})
export class CheckoutSummaryComponent implements OnInit {
  orderDetails: any; // Define the type as needed

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Retrieve order details, you can use route parameters or a shared service
    this.route.data.subscribe(data => {
      this.orderDetails = data['order']; // Assuming order details are passed
    });
  }
}
