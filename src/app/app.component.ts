import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AppService} from "./app.service";
import {log} from "util";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  currency = '$'
  form = this.fb.group({
    order: ["", Validators.required],
    name: ["", Validators.required],
    phone: ["", Validators.required]
  });

  productsData: any;

  constructor(private fb: FormBuilder, private appService: AppService) {}

  ngOnInit() {
      this.appService.getData().subscribe((data:any) => this.productsData = data);
  }

    scrollTo(target: HTMLElement, burger?: any) {
    target.scrollIntoView({behavior: "smooth"});
    if (burger) {
      this.form.patchValue({
        order: `${burger.title} (${burger.price} ${this.currency})`
      })
    }
  }

  confirmOrder() {
    if (this.form.valid) {

      this.appService.sendOrder(this.form.value)
        .subscribe(
          {
            next: (response: any) => {
              alert(response.message)
              this.form.reset();
            },
            error: (response) => {
              alert(response.error.message)
            }
          }
        )
    }
  }

  changeCurrency() {
    let allCurrency: any = [
      {
        value: '$',
        coefficient: 1,
      },
      {
        value: '₽',
        coefficient: 80,
      },
      {
        value: 'BYN',
        coefficient: 3,
      },
      {
        value: '€',
        coefficient: .9,
      },
      {
        value: '¥',
        coefficient: 6.9,
      }
    ];
    let newCurrency: string = this.currency;
    let newCoefficient: number = 1;
    let isFound: boolean = false;

    for (let i = 0; i < allCurrency.length; i++) {
      if (this.currency === allCurrency[i].value) {
        isFound = true;

        if (i === allCurrency.length - 1) {
          i = -1;
        }

        newCurrency = allCurrency[i + 1].value;
        newCoefficient = allCurrency[i + 1].coefficient;
        break;
      }
    }
    this.currency = newCurrency;

    this.productsData.forEach((items: any) => {
      items.price = +(items.basePrice * newCoefficient).toFixed(1)
    })
  }
}
