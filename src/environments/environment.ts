// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  /// baseUrl: 'http://913f-2409-4043-490-4796-e1e5-c951-1465-bb1f.ngrok.io',
  // baseUrl: 'http://ekmatra.store:3000',
  //baseUrl: "http://128.199.17.123:3001",
  //baseUrl: 'https://ekmatra.store',
  baseUrl:'https://staging-api.ekmatra.store/rest',
  
  //adminUrl: 'http://localhost:4201',
  encryptionKey: 'x90dh!2$bs',
  appConfig: {
    currency: {
      code: 'INR',
      symbol: '₹'
    },
    defaultPageSize: 10
  }
};
