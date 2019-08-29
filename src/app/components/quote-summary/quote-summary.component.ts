import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-quote-summary',
  templateUrl: './quote-summary.component.html',
  styleUrls: ['./quote-summary.component.css']
})
export class QuoteSummaryComponent implements OnInit, OnDestroy, OnChanges {
  @Input() selectedStock: string;
  @Output() validSymbol = new EventEmitter();
  @Output() notValidSymbol = new EventEmitter();

  @ViewChild(TableComponent)
  table: TableComponent;
  tableData: any = [];

  loading = true;
  querySubscription: Subscription;
  quoteProfile: any = {};
  quoteData: any = {};

  readonly DEFAULT_TABLE_DATA: any = [
    {
      name: 'Previous Close',
      value: '',
      name2: 'Market Cap',
      value2: ''
    },
    {
      name: 'Open',
      value: '',
      name2: 'Forward P/E',
      value2: ''
    },
    {
      name: 'Day High/Low',
      value: '',
      name2: 'PEG Ratio',
      value2: ''
    },
    {
      name: '52 Week High/Low',
      value: '',
      name2: 'Forward EPS',
      value2: ''
    },
    {
      name: '50 Day Average',
      value: '',
      name2: 'Dividend Rate/Yield',
      value2: ''
    },
    {
      name: '200 Day Average',
      value: '',
      name2: 'Short Float %',
      value2: ''
    },
  ];

  readonly DEFAULT_QUOTE_PROFILE = {
    sector: '',
    industry: ''
  }

  readonly DEFAULT_QUOTE_DATA = {
    symbol: '',
    longName: '',
    fullExchangeName: '',
    regularMarketPrice: {
      fmt: ''
    },
    regularMarketChange: {
      fmt: '',
      raw: null
    },
    regularMarketChangePercent: {
      fmt: ''
    }
  }

  constructor(
    private apollo: Apollo
  ) { }

  ngOnInit() {
    this.getStockDetails();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.selectedStock.firstChange && changes.selectedStock.previousValue !== changes.selectedStock.currentValue) {
      this.tableData = this.DEFAULT_TABLE_DATA;
      this.quoteProfile = this.DEFAULT_QUOTE_PROFILE;
      this.quoteData = this.DEFAULT_QUOTE_DATA;
      this.getStockDetails();
    }
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  getStockDetails() {
    this.querySubscription = this.apollo.watchQuery({
      query: gql`
      query {
        getDetail (stock: ${this.selectedStock}) @rest(type: "getDetail", path: "stock/get-detail?region=US&lang=en&symbol={args.stock}") {
          defaultKeyStatistics
          summaryDetail
          summaryProfile
          quoteData
          symbol
        }
      }
      `,
    })
    .valueChanges.subscribe(({data, loading, errors}) => {
      if (errors) {
        this.loading = true;
        this.notValidSymbol.emit();
      }

      this.loading = loading;
      const symbol = data['getDetail']['symbol'];
      this.validSymbol.emit(symbol);
      this.quoteProfile = data['getDetail']['summaryProfile'];
      this.quoteData = {...data['getDetail']['summaryDetail'], ...data['getDetail']['defaultKeyStatistics'], ...data['getDetail']['quoteData'][symbol]};
      this.createTableData(this.quoteData);
    });
  }

  checkChange(value: number): boolean {
    if (value > 0 ) {
      return true;
    } else {
      return false;
    }
  }

  createTableData(quoteData: any) {
    let dividendData = quoteData['dividendRate']['fmt'] + ' / ' + quoteData['dividendYield']['fmt'];

    if (Object.entries(quoteData['dividendRate']).length === 0 && quoteData['dividendRate'].constructor === Object) {
      dividendData = 'None';
    }

    this.tableData = [
      {
        name: 'Previous Close',
        value: quoteData['regularMarketPreviousClose']['fmt'],
        name2: 'Market Cap',
        value2: quoteData['marketCap']['fmt']
      },
      {
        name: 'Open',
        value: quoteData['regularMarketOpen']['fmt'],
        name2: 'Forward P/E',
        value2: quoteData['forwardPE']['fmt']
      },
      {
        name: 'Day High/Low',
        value: quoteData['regularMarketDayHigh']['fmt'] + ' / ' + quoteData['regularMarketDayLow']['fmt'],
        name2: 'PEG Ratio',
        value2: quoteData['pegRatio']['fmt']
      },
      {
        name: '52 Week High/Low',
        value: quoteData['fiftyTwoWeekHigh']['fmt'] + ' / ' + quoteData['fiftyTwoWeekLow']['fmt'],
        name2: 'Forward EPS',
        value2: quoteData['forwardEps']['fmt']
      },
      {
        name: '50 Day Average',
        value: quoteData['fiftyDayAverage']['fmt'],
        name2: 'Dividend Rate/Yield',
        value2: dividendData
      },
      {
        name: '200 Day Average',
        value: quoteData['twoHundredDayAverage']['fmt'],
        name2: 'Short Float %',
        value2: quoteData['shortPercentOfFloat']['fmt']
      },
    ];
  }
}
