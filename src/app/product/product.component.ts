import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Product } from '../world';

declare var require;
  const ProgressBar = require("progressbar.js");

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  product: Product;
  server: any;
  progressbar: any;
  
  @Input()
  set prod(value: Product) {
    this.product = value;
  }
  @Input()
  set serv(value: any){
    this.server = value;
  }

  @ViewChild('bar') progressBarItem;

  constructor() { }

  startFabrication(){
    this.product.timeleft=this.product.vitesse;
    //this.lastupdate=Date.now();
    this.progressbar.animate(1, { duration: this.product.vitesse });
    //this.progressbar.set(progress); progress entre 0 et 1 pour set la progression de la barre manuellement
  }

  ngOnInit() {
    this.progressbar = new
    ProgressBar.Circle(this.progressBarItem.nativeElement, { strokeWidth: 5, color: '#FFEA82',trailColor: '#eee',
    trailWidth: 1,
    from: {color: '#FFEA82'},
    to: {color: '#ED6A5A'},
    // Set default step function for all animate calls
    step: (state, bar) => {
      bar.path.setAttribute('stroke', state.color);
      } });
      
    //continuer pour repositionner le cercle sur l'image
  }

}
