import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch(err => {
    // Trazamos un único error si falla el arranque
    console.error('Error al iniciar la aplicación Angular:', err);
  });
