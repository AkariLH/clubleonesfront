import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Session } from '../classes/Session';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private cookieValue: string;
  private sessionString: string;

  constructor(private cookieService: CookieService){
    this.cookieService.set('Test', 'this is the Akari test');
    this.cookieValue = this.cookieService.get('Test');
    this.sessionString = 'lkasdjfapwoienca4i290iejdm2qp9iajnsdlfikj9a2';
  }

  public printCookie(){
    console.log(this.cookieValue);
  }

  public saveSession(session: Session){
    this.cookieService.set(this.sessionString, JSON.stringify(session));
  }

  public getSession(): Session{
    let sess: Session;
    sess = JSON.parse(this.cookieService.get(this.sessionString));
    return sess;
  }
}
