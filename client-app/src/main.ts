import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { JwtInterceptor } from './app/interceptors/jwt.interceptor';
import { NgxsModule } from '@ngxs/store';
import { importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    importProvidersFrom(
      NgxsModule.forRoot([]),
      NgxsLoggerPluginModule.forRoot({
        disabled: environment.production,
      })
    ),
    provideHttpClient(),
  ],
});
