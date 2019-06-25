import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

// REST Implementation
@Injectable()
export class StockService {

  constructor(
    private http: HttpClient,
  ) {
    this.bannerQuotes.add('AMZN').add('INTC').add('AAPL').add('GOOG').add('NVDA').add('TSLA');
  }

  readonly BASE_URL = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/';
  private httpOptions = {
    headers: new HttpHeaders({
      'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
      'X-RapidAPI-Key': 'API-KEY-GOES-HERE'
    })
  };
  private bannerQuotes = new Set();
  // Search
  getAutoComplete(text: string) {
    const url = 'market/auto-complete?lang=en&region=US&query=' + text;
    return this.http.get(this.BASE_URL + url, this.httpOptions);
  }
  // Banner %2C = ,
  getQuotes() {
    const queryQuotes = '';
    this.bannerQuotes.forEach( item => {
      const quote = item + ',';
      queryQuotes.concat(quote);
    });
    const url = 'market/get-quotes?region=US&lang=en&symbols=' + queryQuotes;
    return this.http.get(this.BASE_URL + url, this.httpOptions);
  }
  // Quote Summary and Table
  getStockDetail(stockSymbol: string) {
    const url = 'stock/get-detail?region=US&lang=en&symbol=' + stockSymbol;
    this.bannerQuotes.add(stockSymbol);
    return this.http.get(this.BASE_URL + url, this.httpOptions);
  }
}
