import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { PriceQueryEffects } from './+state/price-query.effects';
import { PriceQueryFacade } from './+state/price-query.facade';
import {
  priceQueryReducer,
  PRICEQUERY_FEATURE_KEY
} from './+state/price-query.reducer';
import { CacheInterceptor } from './cache.interceptor';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature(PRICEQUERY_FEATURE_KEY, priceQueryReducer),
    EffectsModule.forFeature([PriceQueryEffects])
  ],
  providers: [PriceQueryFacade,
    {provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true}
  ]
})
export class StocksDataAccessPriceQueryModule {}
