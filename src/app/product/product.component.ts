import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Product } from '../world';

declare var require;
const ProgressBar = require("progressbar.js");

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  lastupdate: number;
  product: Product;
  server: any;
  progressbar: any;
  revenu: number;

  @Input()
  set prod(value: Product) {
    this.product = value;
  }
  @Input()
  set serv(value: any) {
    this.server = value;
  }
  @Output() notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();

  @ViewChild('bar') progressBarItem;

  constructor() { }

  startFabrication() {
    if (this.product.timeleft == 0) {
      this.progressbar.animate(1, { duration: this.product.vitesse });
      this.product.timeleft = this.product.vitesse;
      this.lastupdate = Date.now();
      //this.progressbar.set(progress); progress entre 0 et 1 pour set la progression de la barre manuellement
    }
  }


  ngOnInit() {
    this.progressbar = new
      ProgressBar.Circle(this.progressBarItem.nativeElement, {
        strokeWidth: 5, color: '#FFEA82', trailColor: '#eee',
        trailWidth: 1,
        from: { color: '#ffff66' },
        to: { color: '#00cc66' },
        // Set default step function for all animate calls
        step: (state, bar) => {
          bar.path.setAttribute('stroke', state.color);
        }
      });

    setInterval(() => { this.calcScore(); }, 100);

    //continuer pour repositionner le cercle sur l'image
  }


  calcScore() {
    if (this.product.timeleft != 0) {
      this.product.timeleft -= Date.now() - this.lastupdate;
      this.lastupdate = Date.now();
      if (this.product.timeleft <= 0) {
        this.product.timeleft = 0;
        this.progressbar.set(0);
        // on prévient le composant parent que ce produit a généré son revenu.
        this.notifyProduction.emit(this.product);
      }
    }
  }

}
