// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: {
  production: boolean;
  auth: {
    android: {
      redirectUrl: string;
    };
    emulator: {
      redirectUrl: string;
    };
    web: {
      redirectUrl: string;
    };
  };
} = {
  production: false,
  auth: {
    android: {
      redirectUrl: 'http://10.1.17.184:3000'
    },
    emulator: {
      redirectUrl: 'http://10.1.17.27:3000'
    },
    web: {
      redirectUrl: 'http://localhost:3000',
    },
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
