import { KeycloakService } from "keycloak-angular";

export function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: "https://kc.sentieriecartografia.it/auth",
        realm: "SeC-Test",
        clientId: "backend",
      },
      initOptions: {
        enableLogging: true,
        onLoad:"check-sso"
      },
    });
}
