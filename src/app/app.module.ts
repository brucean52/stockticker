import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';
import { BannerComponent } from './components/banner/banner.component';
import { BannerQuoteComponent } from './components/banner-quote/banner-quote.component';
import { TableComponent } from './components/table/table.component';
import { QuoteSummaryComponent } from './components/quote-summary/quote-summary.component';

import { StockService } from './services/stock.service';
import { GraphQLModule } from './graphql.module';

@NgModule({
  declarations: [
    AppComponent,
    BannerComponent,
    TableComponent,
    BannerQuoteComponent,
    QuoteSummaryComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    GraphQLModule
  ],
  providers: [
    StockService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
