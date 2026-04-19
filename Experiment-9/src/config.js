const runtimeConfig = window.__APP_CONFIG__ ?? {};

export const appConfig = {
  apiBaseUrl: runtimeConfig.API_BASE_URL ?? "http://localhost:3000/api",
  appTitle: runtimeConfig.APP_TITLE ?? "React Docker Deployment",
  environment: runtimeConfig.APP_ENV ?? "development"
};
