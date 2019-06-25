import { Component, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit, OnDestroy {
  @Output() activeQuote = new EventEmitter();
  querySubscription: Subscription;
  DEFAULT_STOCK = 'AMZN';
  quotes = 'AMZN,AAPL,AMD,BA,GOOG,FB,INTC,MSFT,MU,NVDA,TSM,TSLA,WORK';
  quoteArray: any = [];
  loading: boolean = true;

  constructor(
    private apollo: Apollo
  ) { }

  ngOnInit() {
    this.querySubscription = this.apollo.watchQuery({
      query: gql`
      query {
        getQuotes @rest(type: "GetQuotes", path: "market/get-quotes?region=US&lang=en&symbols=${this.quotes}") {
          quoteResponse
        }
      }
      `,
    })
    .valueChanges.subscribe(({data, loading}) => {
      this.loading = loading;
      this.quoteArray = data['getQuotes']['quoteResponse']['result'];
      const defaultStock = this.quoteArray.filter( stock => {
        return stock['symbol'] === this.DEFAULT_STOCK;
      });
      this.activeQuote.emit(defaultStock[0]);
    });
  }
  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
  stockClicked(stockSymbol: string): void {
    const selectedStock = this.quoteArray.filter( stock => {
      return stock['symbol'] === stockSymbol;
    });
    this.activeQuote.emit(selectedStock[0]);
  }
}
