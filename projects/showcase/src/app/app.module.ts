import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SnButtonComponent } from 'projects/ngx-sedna/button';
import { SnInputComponent } from 'projects/ngx-sedna/input';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SnButtonComponent,
    SnInputComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
