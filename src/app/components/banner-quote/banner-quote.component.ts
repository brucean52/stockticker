import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-banner-quote',
  templateUrl: './banner-quote.component.html',
  styleUrls: ['./banner-quote.component.css']
})
export class BannerQuoteComponent implements OnInit {
  @Input() quote: any;
  @Output() activeQuote = new EventEmitter();
  constructor() { }

  ngOnInit() {
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
}
