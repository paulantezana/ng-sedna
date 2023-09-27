import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SnButtonDirective } from 'projects/ngx-sedna/button/button.directive';
import { SnInputDirective } from 'projects/ngx-sedna/input/input.directive';
import { SnFormControlComponent } from 'projects/ngx-sedna/form';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SnButtonDirective,
    SnInputDirective,
    SnFormControlComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
