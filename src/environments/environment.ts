// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// You can run the server in production mode by running `ng serve -prod`.
export const environment = {
  production: false,
  SERVER_URL: "http://127.0.0.1:8888",
  COOKIE_DOMAIN: ".localhost",
};
