import { Component } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  world: World = new World();
  product: Product = new Product();
  server: string;
  qtmulti= 0;
  qt=["x1","x10","x100","xMax"];
  //pallier: Pallier = new Pallier();
  //seuil: number;
  
  
  constructor(private service: RestserviceService) {
  this.server = service.getServer();
  service.getWorld().then(
    world => {
    this.world = world;
    });
    }
   
onProductionDone(p: Product){
  this.world.money += p.revenu*p.quantite;
  this.world.score += p.revenu*p.quantite;
}

onBuy(n: number){
  this.world.money-=n;
  this.world.score-=n;
}

changEtatBouton(){
  if (this.qtmulti==3){
    this.qtmulti=0;
    console.log(this.qtmulti);
  }else{
    this.qtmulti+=1;
    console.log(this.qtmulti);
  }
}

hire(v: Pallier){
   if(this.world.money>=v.seuil){ //PB on arrive pas à lire la variable seuil
      v.unlocked=true; //on unlock le manager
      this.world.products.product[v.idcible-1].managerUnlocked=true;
      this.onBuy(v.seuil);
      console.log("c'est acheté");
      if (v.unlocked=true){
        this.isHidden(v);
      }
    }
}


isHidden(v: Pallier){
  if (v.unlocked==true){
   return true;
  }
  else{
    return false;
  }
}

}
