import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

interface ExchangeRateData {
  conversion_rate: number;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  baseUrl = `https://v6.exchangerate-api.com/v6/af3b6d4b4e1dfe63e5042906`;

  selectedCurrency1: string = 'USD';
  amount1: number = 1;
  selectedCurrency2: string = 'EUR';
  amount2: number = 0;
  currencies: string[] = [];
  mainCurrencies: string[] = ['USD', 'EUR', 'GBP', 'GEL', 'CAD'];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get(`${this.baseUrl}/latest/USD`)
      .pipe(
        catchError(() => {
          throw new Error('Failed to fetch currency data');
        })
      )
      .subscribe(() => {
        this.currencies = this.mainCurrencies;
      });

    this.updateCurrency2();
  }

  updateCurrency2() {
    this.http
      .get<ExchangeRateData>(
        `${this.baseUrl}/pair/${this.selectedCurrency1}/${this.selectedCurrency2}`
      )
      .pipe(
        catchError(() => {
          throw new Error('Failed to fetch exchange rate data');
        }),
        map((data: ExchangeRateData) => {
          return this.amount1 * data.conversion_rate;
        })
      )
      .subscribe((result) => {
        this.amount2 = result;
      });
  }
}
