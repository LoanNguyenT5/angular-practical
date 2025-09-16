import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import { DashboardOutline, MenuFoldOutline, MenuUnfoldOutline, UserOutline } from '@ant-design/icons-angular/icons';
const icons: IconDefinition[] = [DashboardOutline, MenuFoldOutline, MenuUnfoldOutline, UserOutline];

import { routes } from './app/app.routes'; 

bootstrapApplication(App, {
  providers: [
    ...appConfig.providers ?? [],
    provideAnimations(),
    importProvidersFrom(NzIconModule.forRoot(icons)),
    provideRouter(routes)
  ]
}).catch(err => console.error(err));
