import { Component, Output,EventEmitter, Input } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';
import { ToasterModule, ToasterService } from 'angular2-toaster';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  username: string;
  title = 'app';
  world: World = new World();
  product: Product = new Product();
  server: string;
  qtmulti= 0;
  qt=["x1","x10","x100","xMax"];
  //pallier: Pallier = new Pallier();
  //seuil: number;
  toasterService: ToasterService;
  idmanager = 0;
  @Output() notifyChange: EventEmitter<boolean> = new EventEmitter(true); 
  

  
  constructor(private service: RestserviceService, toasterService: ToasterService) {
  this.server = service.getServer();
  this.toasterService = toasterService;

  service.getWorld().then(
    world => {
    this.world = world;
    });
    }
   
onProductionDone(p: Product){
  this.world.money += p.revenu*p.quantite;
  this.world.score += p.revenu*p.quantite;
  this.newmemeBadge();
}

onBuy(n: number){
  this.world.money-=n;
  this.world.score-=n;
}

newmemeBadge(){
  switch(this.idmanager){
    case 0 : 
    if(this.world.money>=1000){
      return false;
    }else{
      return true;
    }
    case 1 : 
    if(this.world.money>=15000){
      return false;
    }else{
      return true;
    }
    case 2 : 
    if(this.world.money>=100000){
      return false;
    }else{
      return true;
    }
    case 3 : 
    if(this.world.money>=500000){
      return false;
    }else{
      return true;
    }
    case 4 : 
    if(this.world.money>=1200000){
      return false;
    }else{
      return true;
    }
    case 5 : 
    if(this.world.money>=10000000){
      return false;
    }else{
      return true;
    }
  }
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
   if(this.world.money>=v.seuil){ 
      v.unlocked=true; //on unlock le manager
      this.world.products.product[v.idcible-1].managerUnlocked=true;
      this.onBuy(v.seuil);
      this.toasterService.pop('success', 'Manager hired ! ', v.name);
      console.log("c'est acheté");
      if (v.unlocked=true){
        this.isHidden(v);
      }
      this.idmanager+=1; //du test
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


onUsernameChanged(e: Event){
  this.username = localStorage.getItem("username") + String(Math.floor(Math.random() * 10));
  console.log(this.username);
  localStorage.setItem("username", this.username);
  this.notifyChange.emit(true);
}

}
