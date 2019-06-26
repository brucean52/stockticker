import { Component, Input, OnInit, OnDestroy, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
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
  @Input() selectedStock: any;
  @ViewChild(TableComponent)
  table: TableComponent;
  tableData: any = [
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

  loading = true;
  querySubscription: Subscription;
  quoteProfile: any = {};
  quoteData: any = {};

  constructor(
    private apollo: Apollo
  ) { }

  ngOnInit() {
    if (this.selectedStock.hasOwnProperty('symbol')) {
      this.getStockDetails();
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (!changes.selectedStock.firstChange && changes.selectedStock.previousValue !== changes.selectedStock.currentValue) {
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
        getDetail (stock: ${this.selectedStock['symbol']}) @rest(type: "getDetail", path: "stock/get-detail?region=US&lang=en&symbol={args.stock}") {
          defaultKeyStatistics
          summaryDetail
          summaryProfile
        }
      }
      `,
    })
    .valueChanges.subscribe(({data, loading}) => {
      this.loading = loading;
      this.quoteProfile = data['getDetail']['summaryProfile'];
      this.quoteData = {...data['getDetail']['summaryDetail'], ...data['getDetail']['defaultKeyStatistics']};
      this.createTableData(this.quoteData);
    });
  }
  formatValue(value: number): number {
    return parseFloat(value.toFixed(2));
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
