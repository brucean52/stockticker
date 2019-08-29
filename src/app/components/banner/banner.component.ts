import { Component, Output, OnInit, OnChanges, SimpleChanges, EventEmitter, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit, OnChanges {
  @Input() quoteArray: string[];
  @Input() loading: boolean;
  @Output() activeQuote = new EventEmitter();
  @Output() bannerReady = new EventEmitter();

  quoteArr: any;
  
  constructor(
    private apollo: Apollo
  ) { }

  ngOnInit() {
    this.getBannerQuotes(this.quoteArray.join(','));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.quoteArray && !changes.quoteArray.firstChange && changes.quoteArray.currentValue) {
      this.getBannerQuotes(changes.quoteArray.currentValue.join(','));
    }
  }

  getBannerQuotes(symbols: string) {
    this.apollo.watchQuery({
      query: gql`
      query {
        getQuotes (symbols: "${symbols}") @rest(type: "GetQuotes", path: "market/get-quotes?region=US&lang=en&symbols={args.symbols}") {
          quoteResponse
        }
      }
      `,
    })
    .valueChanges.subscribe(({data, loading}) => {
      this.quoteArr = data['getQuotes']['quoteResponse']['result'];
      if (this.loading) {
        this.bannerReady.emit();
      }
    });
  }
  
  stockClicked(stockSymbol: string): void {
    const selectedStock = this.quoteArr.filter( stock => {
      return stock['symbol'] === stockSymbol;
    });
    this.activeQuote.emit(selectedStock[0]['symbol']);
  }
}
