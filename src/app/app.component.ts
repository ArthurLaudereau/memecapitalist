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
}
