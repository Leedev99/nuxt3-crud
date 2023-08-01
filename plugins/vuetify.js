// plugins/vuetify.js
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
// import { VDataTable } from "vuetify/labs/VDataTable";
export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
  });
  nuxtApp.vueApp.use(vuetify);
  // const vuetify = createVuetify({
  //   components: {
  //     ...components,
  //     VDataTable,
  //   },
  //   directives,
  // });

  // nuxtApp.vueApp.use(vuetify);
});
