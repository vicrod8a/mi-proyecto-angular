import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { providePrimeNG } from 'primeng/config';
// theme CSS will be loaded via CDN links in index.html

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    providePrimeNG({
      // disable built-in theme import; using CDN links instead
      theme: 'none'
    })
  ]
});