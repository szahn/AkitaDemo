import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PlacesContainerComponent } from './places/places-container/places-container.component';
import { PlacesFormComponent } from './places/places-form/places-form.component';
import { PlacesMapComponent } from './places/places-map/places-map.component';
import { PlacesTableComponent } from './places/places-table/places-table.component';

import { GoogleMapsModule } from '@angular/google-maps'

import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';

@NgModule({
  declarations: [AppComponent, PlacesContainerComponent, PlacesFormComponent, PlacesMapComponent, PlacesTableComponent],
  imports: [BrowserModule, GoogleMapsModule, HttpClientModule, ReactiveFormsModule, FormsModule, AkitaNgDevtools.forRoot()],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
