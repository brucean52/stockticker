import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map, debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {
  @Input() isValidStock: boolean;
  @Output() searchStock = new EventEmitter();

  searchTerm$ = new Subject<string>();
  searchOption$ = new BehaviorSubject<any[]>([]);
  searchControl = new FormControl();

  constructor(
    private apollo: Apollo
  ) {}

  ngOnInit() {
    this.getAutoComplete(this.searchTerm$)
    .subscribe( data => {
      this.searchOption$.next(data);
    });
  
    this.searchControl.valueChanges.subscribe( stock => {
      this.searchTerm$.next(stock);
    });
  }

  getAutoComplete(query: Subject<string>) {
    return query.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (term === '') {
          return [];
        } else {
          return this.apollo.watchQuery({
            query: gql`
              query {
                getAutoComplete(query: ${term}) @rest(type: "GetAutoComplete", path: "market/auto-complete?region=US&lang=en&query={args.query}") {
                  ResultSet
                }
              }
              `,
            })
            .valueChanges.pipe(
              map( data => {
                return data['data']['getAutoComplete']['ResultSet']['Result']
              })
            )
          }
      })      
    );  
  }

  onKeydown(event) {
    if (event.key === "Enter") {
      this.searchStock.emit(event.target.value);
    } else if (event.target.value === '') {
      this.searchOption$.next([]);
    }
  }
  
  stockSelected(symbol) {
    this.searchStock.emit(symbol);
  }
}
