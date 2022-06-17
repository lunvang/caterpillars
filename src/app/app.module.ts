import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxJoystickModule } from 'ngx-joystick';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxJoystickModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
