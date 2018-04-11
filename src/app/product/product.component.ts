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
  //_cout:any;
  PT:number;
  NBachat: number; 
  canBuy= false;
  qMax:any;

  @Input()
  set qtmulti(value: string) {
    this._qtmulti = value;
    if (this._qtmulti && this.product) this.calcMaxCanBuy();
  }
  
  @Input()   
  set money(value: any) {
      this._money = value;    
  }

  @Input()
    set prod(value: Product) {
      this.product = value;
      this.PT=value.cout;
    }
    @Input()
    set serv(value: any) {
      this.server = value;
    }
    



    constructor() { }

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

      setInterval(() => { this.calcScore();}, 100);
    }

    startFabrication() {
      if (this.product.timeleft <= 0 &&this.product.quantite!=0) {
        this.progressbar.animate(1, { duration: this.product.vitesse });
        this.product.timeleft = this.product.vitesse;
        this.lastupdate = Date.now();
        //this.progressbar.set(progress); progress entre 0 et 1 pour set la progression de la barre manuellement
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
          this.PT = this.product.cout*(this.product.croissance**(this.product.quantite-1));
          this.chCanBuy();
          break;
        case "x10" : 
          this.NBachat = 10;
          this.PT = ((this.product.cout*(1-this.product.croissance**(this.product.quantite+this.NBachat+1)))/(1-this.product.croissance))-((this.product.cout*(1-this.product.croissance**(this.product.quantite+1)))/(1-this.product.croissance));
          this.chCanBuy();
          break;
        case "x100" : 
          this.NBachat = 100;
          this.PT = ((this.product.cout*(1-this.product.croissance**(this.product.quantite+this.NBachat+1)))/(1-this.product.croissance))-((this.product.cout*(1-this.product.croissance**(this.product.quantite+1)))/(1-this.product.croissance));          this.chCanBuy();
          break;
        case "xMax":
          //this.NBachat = Math.floor(Math.log(this._money/(this.product.cout))/Math.log(this.product.croissance)); //floor pour arrondir, et prise en compte de la croissance a chaque niveau avec les logs
          //this.qMax = Math.floor((Math.log(1-(this._money/((this.product.cout)*(1-this.product.croissance)*this.product.quantite))))/Math.log(this.product.croissance));
          this.qMax = Math.ceil((Math.log(1-((this._money+this.product.cout*((1-this.product.croissance**(this.product.quantite+1))/1-this.product.croissance))/this.product.cout)*(1-this.product.croissance))/Math.log(this.product.croissance))-(this.product.quantite-2));
          //this.qMax = Math.floor((Math.log(1-(this._money/this.product.cout)*(1-this.product.croissance)))/Math.log(this.product.croissance));
          this.NBachat = this.qMax-2;
          //console.log(this.qMax);
          //this.PT = (this.product.cout * ((this.product.croissance ** (this.NBachat+this.product.quantite))/(this.product.croissance)));
          this.PT = ((this.product.cout*(1-this.product.croissance**(this.product.quantite+this.NBachat)))/(1-this.product.croissance))-((this.product.cout*(1-this.product.croissance**(this.product.quantite+1)))/(1-this.product.croissance));          this.chCanBuy();
          //console.log(this.PT);
          //var _i = 0;
          //do{
          //  _i++;
          //  this.PT = this.product.quantite*this.product.cout*this.product.croissance**_i;
          //}while (this.PT<(this._money-this.product.cout*this.product.quantite))
          //this.NBachat =_i;
          if (this.NBachat<=0){
            this.NBachat=1;
            this.PT=this.product.cout*(this.product.croissance**(this.product.quantite-1));
          }
           
          this.chCanBuy();
          break;
        }
    }
    
    calcScore() {
      if(this.product.managerUnlocked==true){
        this.startFabrication();
        this.product.timeleft -= Date.now() - this.lastupdate;
        this.lastupdate = Date.now();
      }
      if (this.product.timeleft > 0) {
        this.product.timeleft -= Date.now() - this.lastupdate;
        this.lastupdate = Date.now();}

      else if (this.product.timeleft < 0) {
          this.progressbar.set(0);
          this.product.timeleft = 0;
          // on prévient le composant parent que ce produit a généré son revenu.
          if (this.lastupdate!=0){
            this.notifyProduction.emit(this.product);
            this.lastupdate=0;
            }
      }
      this.chCanBuy();
      this.calcMaxCanBuy();
    }

    chCanBuy(){
      if (this.PT!=0 && this._money >= this.PT && this.NBachat!=0){
        this.canBuy = true;
      }else{
        this.canBuy = false;
      }
    }
    
    buy(){
      if(this.canBuy){
        this.product.quantite+=this.NBachat;
        //this._money-=this.PT
        this.notifyBuy.emit(this.PT);
        
      }
    }

  }
