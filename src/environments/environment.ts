// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,

    // S&C Env vars
    realm: "cai-bologna",
    instance: "sec_bologna_1",
    publicName: "CAI Bologna",
    northWestBoundsLatLng: [44.810096, 10.355102],
    southEastBoundsLatLng: [43.741833, 12.036322],
    issueReportingList: [
        "Schianto d'albero su sentiero",
        "Sentiero smottato/franato",
        "Sentiero invaso da piante",
        "Sentiero non visibile"
    ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
