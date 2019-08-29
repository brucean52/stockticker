import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loading: boolean = true;
  selectedStock: string = 'AMZN';
  isValidStock: boolean = true;
  quoteArray: string[] = ['AMZN','AAPL','AMD','BA','GOOG','FB','INTC','MSFT','MU','NVDA','TSM','TSLA','WORK'];

  activeQuote(stockSymbol: string): void {
    this.selectedStock = stockSymbol;
  }

  bannerReady(): void {
    this.loading = false;
  }

  addStock(stockSymbol: string):void {
    if (!this.quoteArray.includes(stockSymbol)) {
      this.quoteArray.push(stockSymbol);
      this.quoteArray = this.quoteArray.sort().slice();
    }
  }

  searchStock(stockSymbol: string): void {
    this.selectedStock = stockSymbol;
    this.addStock(stockSymbol);
  }

  validSymbol(stockSymbol: string): void {
    this.isValidStock = true;
    this.addStock(stockSymbol);
  }

  notValidSymbol(): void {
    this.isValidStock = false;
  }
}
