import { Injectable } from '@angular/core';
import { Http, HttpModule, Response, Headers } from '@angular/http'
import { World, Pallier, Product } from './world';

@Injectable()
export class RestserviceService {
  server = "http://localhost:8080/Meme_Capitalist/"
  user = "";
  constructor(private http: Http) { }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
   }
   getWorld(): Promise<World> {
    return this.http.get(this.server + "webresources/world")
    .toPromise().then(response =>response.json()).catch(this.handleError);
   };
   getUser():string{
     return this.user;
   }
   setUser(user:string):void{
     this.user=user;
   }
   getServer():string{
     return this.server;
   }
   
}
