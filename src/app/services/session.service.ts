import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Session } from '../classes/Session';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private sessionKey: string = 'userSession';
  public sessionActive: Session;

  constructor(private cookieService: CookieService) {
    this.cookieService.set('Test', 'this is the Akari test');
    this.sessionActive = new Session('', '', '', 0);
  }

  public printCookie() {
    console.log(this.cookieService.getAll());
  }

  public saveSession(session: Session) {
    this.cookieService.set(this.sessionKey, JSON.stringify(session));
    this.sessionActive = session;
  }

  public getSession(): Session {
    const sessionData = this.cookieService.get(this.sessionKey);
    if (!sessionData) {
      return new Session('', '', '', 0); // Devuelve un objeto Session vacío
    }

    try {
      const session = JSON.parse(sessionData) as Session;
      this.sessionActive = session;
      return session;
    } catch (error) {
      console.error('Error parsing session data:', error);
      return new Session('', '', '', 0); // Devuelve un objeto Session vacío en caso de error
    }
  }

  public clearSession() {
    this.cookieService.delete(this.sessionKey);
    this.sessionActive = new Session('', '', '', 0);
    console.log('Sesión eliminada correctamente.');
  }
}