import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedStock: any = {};
  listQuotes: any;

  activeQuote(stock: any): void {
    this.selectedStock = stock;
  }
}
