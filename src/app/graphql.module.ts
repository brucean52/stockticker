import {NgModule} from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { RestLink } from 'apollo-link-rest';

const restLink = new RestLink({
  uri: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/',
  headers: {
    'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
    'X-RapidAPI-Key': 'API-KEY-GOES-HERE'
  }
});

export function createApollo() {
  return {
    link: restLink,
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo
    },
  ],
})
export class GraphQLModule {}
