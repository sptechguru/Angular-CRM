// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  //baseUrl: 'https://33ca27c4e327.ngrok.io',
  //baseUrl: 'http://ekmatra.store:3000',
  baseUrl: 'http://13.235.54.240/rest/api',
  //baseUrl: 'https://ekmatra.store',
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
