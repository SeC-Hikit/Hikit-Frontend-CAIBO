import {Injectable} from "@angular/core";
import {KeycloakService} from "keycloak-angular";
import {environment} from '../../environments/environment';
import {components} from "../../binding/Binding";

export type RecordDetailsDto = components['schemas']['RecordDetailsDto'];

@Injectable({
    providedIn: "root",
})
export class AuthService {


    constructor(private keycloakService: KeycloakService) {
    }

    async onIsAuth(onLoggedIn: () => void, onNotLogged?: () => void) {
        const notLoggedCallback = onNotLogged == null ? () => {
        } : onNotLogged;
        this.keycloakService.isLoggedIn().then((isIn) => {
            console.log(isIn);
            isIn ? onLoggedIn() : notLoggedCallback();
        });
    }

    async getUsername(): Promise<string> {
        let any: any = this.keycloakService.getKeycloakInstance().idTokenParsed;
        return any.preferred_username;
    }

    getUserRealm(): string {
        let userLoggedInToken: any = this.keycloakService.getKeycloakInstance().idTokenParsed;
        if (userLoggedInToken == null) {
            return "";
        }
        return userLoggedInToken.realm;
    }

    async getUserRole(): Promise<string> {
        let userLoggedInToken: any = this.keycloakService.getKeycloakInstance().idTokenParsed;
        if (userLoggedInToken == null) {
            return "";
        }
        console.log(userLoggedInToken);
        return userLoggedInToken.role;
    }

    getInstanceRealm() : string {
        return environment.realm;
    }

    isRealmMatch(): boolean {
        return this.getUserRealm() == this.getInstanceRealm();
    }

    getSection(): string {
        let any: any = this.keycloakService.getKeycloakInstance().idTokenParsed;
        return any.section;
    }

    logout() {
        this.keycloakService.logout("/#");
    }
}
