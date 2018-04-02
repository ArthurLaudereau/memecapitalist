import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { World, Product } from '../world';

declare var require;
const ProgressBar = require("progressbar.js");

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  @ViewChild('bar') progressBarItem;
  @Output() notifyProduction: EventEmitter < Product > = new EventEmitter<Product>();
  @Output() notifyBuy: EventEmitter<number> = new EventEmitter<number>(); 

  world: World = new World();
  lastupdate: number;
  product: Product;
  server: any;
  progressbar: any;
  revenu: number;
  _qtmulti: string;
  _money: any;
  PT:number;
  NBachat: number; 
  canBuy= false;

  @Input()
  set qtmulti(value: string) {
    this._qtmulti = value;
    if (this._qtmulti && this.product) this.calcMaxCanBuy();
  }

  @Input()
    set prod(value: Product) {
      this.product = value;
    }
    @Input()
    set serv(value: any) {
      this.server = value;
    }
    



    constructor() { }

    startFabrication() {
      if (this.product.timeleft <= 0) {
        this.progressbar.animate(1, { duration: this.product.vitesse });
        this.product.timeleft = this.product.vitesse;
        this.lastupdate = Date.now();
        //this.progressbar.set(progress); progress entre 0 et 1 pour set la progression de la barre manuellement
        //this.service.putProduct(this.product); a voir plus tard
      }
    }

    calcMaxCanBuy(){
      //PP : Prix du prochain produit
      //this.PP = this.product.cout*this.product.croissance^this.product.quantite
      //PT : Prix Total des produits
      //this.PT = this.PP;
      //Nombre d'achats possibles
      //this.NBachat = 0;
      switch(this._qtmulti){
        case "x1" : 
          this.NBachat = 1;
          this.PT = this.product.cout*this.product.croissance^this.product.quantite;
          //return (this.NBachat,this.PP); on réutilisera ces valeurs
          this.chCanBuy();
          break;
        case "x10" : 
          this.NBachat = 10;
          this.PT = this.product.cout*this.product.croissance^this.NBachat;
          this.chCanBuy();
          break;
        case "x100" : 
          this.NBachat = 100;
          this.PT = this.product.cout*this.product.croissance^this.NBachat;
          this.chCanBuy();
          break;
        case "xMax":
        this.NBachat = 0;
        this.PT = this.product.cout*this.product.croissance^this.NBachat;
          while (this.world.money>=this.PT){
            this.NBachat = this.NBachat+1;
            this.PT = this.PT*this.product.croissance;
          }
          this.chCanBuy();
          break;
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
      if (this.product.timeleft > 0) {
        this.product.timeleft -= Date.now() - this.lastupdate;
        this.lastupdate = Date.now();}

      else if (this.product.timeleft < 0) {
          this.product.timeleft = 0;
          this.progressbar.set(0);
          // on prévient le composant parent que ce produit a généré son revenu.
          this.notifyProduction.emit(this.product);
          if (this.lastupdate!=0){
            this.notifyProduction.emit(this.product);
            this.lastupdate=0;
            }
      }
    }

    chCanBuy(){
      if (this.PT!=0 && this._money >= this.PT){
        this.canBuy = true;
      }else{
        this.canBuy = false;
      }
    }
    buy(){
      if(this.canBuy){
        this.product.quantite+=this.NBachat;
        this.notifyBuy.emit(this.PT)
      }
    }

  }
