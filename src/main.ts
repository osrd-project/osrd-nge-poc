import {enableProdMode} from "@angular/core";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {AppModule} from "../node_modules/netzgrafik-frontend/src/app/app.module";
import {environment} from "../node_modules/netzgrafik-frontend/src/environments/environment";

if (environment.production) {
  enableProdMode();
}

console.log("OSRD-NGE proof of concept");

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
