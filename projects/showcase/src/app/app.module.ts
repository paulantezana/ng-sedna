import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SnButtonDirective } from 'projects/ngx-sedna/button/button.directive';
import { SnInputDirective } from 'projects/ngx-sedna/input/input.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { SnFormModule } from 'projects/ngx-sedna/form';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    SnButtonDirective,
    SnInputDirective,
    SnFormModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
