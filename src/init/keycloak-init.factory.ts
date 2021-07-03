import { KeycloakService } from "keycloak-angular";

export function initializeKeycloak(
  keycloak: KeycloakService
  ) {
    return () =>
      keycloak.init({
        config: {
          url: 'http://localhost:10010' + '/auth',
          realm: 'SeC',
          clientId: 'backend',
        }
      });
}