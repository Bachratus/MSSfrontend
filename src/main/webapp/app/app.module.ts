import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AppRoutingModule } from './app-routing.module';
import { httpInterceptorProviders } from 'app/core/interceptor/index';
import MainComponent from './layouts/main/main.component';
import MainModule from './layouts/main/main.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ButtonModule } from 'primeng/button';
import { PagesModule } from './pages/pages.module';

@NgModule({
  imports: [
    PagesModule,
    ButtonModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MainModule,
  ],
  providers: [
    httpInterceptorProviders,
  ],
  bootstrap: [MainComponent]
})
export class AppModule {
  constructor(applicationConfigService: ApplicationConfigService) {
    applicationConfigService.setEndpointPrefix(SERVER_API_URL);
  }
}
