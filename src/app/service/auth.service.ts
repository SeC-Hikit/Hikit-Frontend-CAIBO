import { Injectable } from "@angular/core";
import { KeycloakService } from "keycloak-angular";
import { env } from "process";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private keycloakService: KeycloakService) {}

  async onIsAuth(onLoggedIn: () => void, onNotLogged?: () => void) {
    const notLoggedCallback = onNotLogged == null ? ()=> {} : onNotLogged;
    this.keycloakService.isLoggedIn().then((isIn) => {
      console.log(isIn);
      isIn ? onLoggedIn() : notLoggedCallback();
    });
  }

  async getUsername(): Promise<string> {
    let any: any = this.keycloakService.getKeycloakInstance().idTokenParsed;
    return any.preferred_username;
  }

  getRealm(): string {
    let userLoggedInToken: any = this.keycloakService.getKeycloakInstance().idTokenParsed;
    if(userLoggedInToken == null) {
      return environment.realm;
    }
    return userLoggedInToken.realm;
  }

  getSection(): string {
    let any: any = this.keycloakService.getKeycloakInstance().idTokenParsed;
    return any.section;
  }

  logout() {
    this.keycloakService.logout("/#");
  }
}
