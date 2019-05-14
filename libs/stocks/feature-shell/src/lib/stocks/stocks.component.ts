import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  stockPickerForm: FormGroup;
  symbol: string;
  dateFrom: Date;
  dateTo: Date;
  viewValue: string;
  value: string;
  quotes$ = this.priceQuery.priceQueries$;
  todaysDate: Date = new Date();



  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
    this.stockPickerForm = fb.group({
      symbol: [null, Validators.required],
      dateFrom: [null, Validators.required],
      dateTo: [null, Validators.required]
    }, {validator: this.dateLessThan('dateFrom', 'dateTo')});
  }

  /**
   * We feed from and to date and compare them
   * then returns validation message
   */
  dateLessThan(from: string, to: string) {
    return (group: FormGroup): {[key: string]: any} => {
      const f = group.controls[from];
      const t = group.controls[to];
      if (f.value > t.value) {
          return {
          dates: "Date from should be less than Date to"
        };
      }
      return {};
    }
  }

  ngOnInit() {}

  fetchQuote = () => {
    if (this.stockPickerForm.valid) {
      const { symbol,  dateFrom, dateTo } = this.stockPickerForm.value;
      this.priceQuery.fetchQuote(symbol, dateFrom, dateTo);
    }
  }

}
