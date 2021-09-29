import { KeycloakService } from "keycloak-angular";

export function initializeKeycloak(
  keycloak: KeycloakService
  ) {
    return () =>
      keycloak.init({
        config: {
          url: 'https://80.211.159.76:8443/auth/',
          realm: 'SeC-Test',
          clientId: 'backend',
        }
      });
}