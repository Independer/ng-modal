import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { ModalRouteComponent } from './modal-route.component';
import { ModalComponent } from './modal.component';
import { IndModalModule } from 'ind-modal';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ModalComponent,
    ModalRouteComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    IndModalModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ModalComponent]
})
export class AppModule { }
