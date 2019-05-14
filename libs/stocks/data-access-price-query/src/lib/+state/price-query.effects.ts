import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  StocksAppConfig,
  StocksAppConfigToken
} from '@coding-challenge/stocks/data-access-app-config';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import {
  FetchPriceQuery,
  PriceQueryActionTypes,
  PriceQueryFetched,
  PriceQueryFetchError
} from './price-query.actions';
import { PriceQueryPartialState } from './price-query.reducer';
import { PriceQueryResponse } from './price-query.type';

@Injectable()
export class PriceQueryEffects {
  @Effect() loadPriceQuery$ = this.dataPersistence.fetch(
    PriceQueryActionTypes.FetchPriceQuery,
    {
      run: (action: FetchPriceQuery, state: PriceQueryPartialState) => {
        return this.httpClient
          .get(
            `${this.env.apiURL}/beta/stock/${action.symbol}/chart/max?token=${this.env.apiKey}`
          )
          .pipe(
            map(resp => {
              // All stocks data
              let responseData: any = resp;
              /**
               * setting hours, minutes, sec and ms of Date object to 0
               * so that we can compare dates without time
               */
              const timeLessDateFrom = action.dateFrom.setHours(0, 0, 0, 0);
              const timeLessDateTo = action.dateTo.setHours(0, 0, 0, 0);

              /**
               * compare and get data between two user entered dates
               */
              responseData = responseData.filter(item => {
                const timeLessStockDate = this.removeTimeFromDate(item.date, '-', '/');
                // for stocks with date >= dateFrom and stocks with date <= DateTo
                return timeLessStockDate >= timeLessDateFrom && timeLessStockDate <= timeLessDateTo;
              });

              return new PriceQueryFetched(responseData as PriceQueryResponse[]);
            })
          );
      },

      onError: (action: FetchPriceQuery, error) => {
        return new PriceQueryFetchError(error);
      }
    }
  );

  /****************************************************************
   * removeTimeFromDate function performs 2 tasks               ***
   * 1. Change date format from yyyy-mm-dd to yyyy/mm/dd        ***
   * 2. setting hours, minutes, sec and ms of Date object to 0  ***
   *    so that we can compare dates without time               ***
   ****************************************************************/
  removeTimeFromDate = (target, search, replacement) => {
    const newDate = target.split(search).join(replacement);
    return new Date(newDate).setHours(0,0,0,0);
  };

  constructor(
    @Inject(StocksAppConfigToken) private env: StocksAppConfig,
    private httpClient: HttpClient,
    private dataPersistence: DataPersistence<PriceQueryPartialState>
  ) {}
}
