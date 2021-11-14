import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";

const app = createApp(App);
/*
Sentry.init({
  app,
  dsn: "https://f09e33ebeef1496b877ceebdcba1ff14@sentry.j42.org/22",
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
    }),
  ],
  tracesSampleRate: 1.0,
});
*/

app.use(router).mount("#app");
