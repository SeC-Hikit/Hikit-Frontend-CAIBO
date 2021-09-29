import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private keycloakService: KeycloakService) { }

  async onIsAuth() {
      return this.keycloakService.isLoggedIn();
  }

  getUsername() : string {
    let any : any = this.keycloakService.getKeycloakInstance().idTokenParsed;
    return any.preferred_username; 
  }

  getRealm() : string {
    let any : any = this.keycloakService.getKeycloakInstance().idTokenParsed;
    return any.realm;
  }

  getSection() : string {
    let any : any = this.keycloakService.getKeycloakInstance().idTokenParsed;
    return any.section;
  }

  logout() {
    this.keycloakService.logout("/#");
  }

}
