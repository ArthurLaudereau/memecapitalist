import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Product } from '../world';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  product: Product;
  progressbar: any;
  @ViewChild('bar') progressBarItem;
  
  
  @Input()
  set prod(value: Product) {
    this.product = value;
  }
  constructor() { }

  ngOnInit() {
    this.progressbar = new
      this.progressbar.Line(this.progressBarItem.nativeElement, { strokeWidth: 50, color: '#00ff00' });
      this.progressbar.animate(1, { duration: this.product.vitesse });
      //this.progressbar.set(progress); pour repartir avec le timeleft
    }

}
