import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PlaceQuery } from 'apps/akitademo/src/core/place/place-entity.query';
import { catchError, finalize, of, Subject, take, takeUntil, throwError } from 'rxjs';
import { GoogleMapsService } from '../googlemaps.service';
import {Countries, States, Categories} from '../places-constants';
import {keyBy} from 'lodash/fp';
import { PlaceService } from 'apps/akitademo/src/core/place/place-entity.service';
import { PlaceModel } from 'apps/akitademo/src/core/place/place-entity.model';

interface SuggestedPlace {
  name : string;
  placeId: string;
  address: string;
}

@Component({
  selector: 'places-form',
  templateUrl: './places-form.component.html',
  styleUrls: ['./places-form.component.scss'],
})
export class PlacesFormComponent implements OnInit, OnDestroy {

  public showNearbyListings: boolean = false;
  protected readonly destroy$: Subject<void> = new Subject();
  public error : any;
  public isBusy: boolean = false;
  public defaultAddress : any;
  public activePlace : PlaceModel | null = null;

  private location : {lat : number, lng : number} = {lat:0, lng: 0};
  
  public StateDataSource = Object.keys(States).map(key => {
    return {value: States[key], text: key}
  });

  public CategoryDataSource = Object.keys(Categories).map(key => {
    return {value: Categories[key], text: key}
  });

  public form: FormGroup = new FormGroup({
    name: new FormControl({value: '', disabled: true}, Validators.required),
    category: new FormControl({value: this.CategoryDataSource[0].value, disabled: true}),
    address1: new FormControl({value: '', disabled: true}, Validators.required),
    address2: new FormControl({value: '', disabled: true}),
    lat: new FormControl({value: 0, disabled: true}),
    lng: new FormControl({value: 0, disabled: true}),
    city: new FormControl({value: '', disabled: true}, Validators.required),
    state: new FormControl({value: '', disabled: true}, Validators.required),
    zip: new FormControl({value: '', disabled: true}, Validators.required),
    country: new FormControl({value: '', disabled: true})
  });

  public suggestedPlaces : SuggestedPlace[] = [];

  constructor(private mapsService : GoogleMapsService, private placeQuery: PlaceQuery, private placeService : PlaceService) {

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  ngOnInit(): void {

    this.placeQuery.selectActive().pipe(
      takeUntil(this.destroy$))
      .subscribe((place : PlaceModel | undefined) => {
        this.activePlace = place ?  place : null;
        if (place) {
          this.form.patchValue({
            name: place.name,
            address1: place.address1,
            address2: place.address2,
            city: place.city,
            state: place.state,
            country: place.country,
            zip: place.zip,
            lat: place.lat,
            lng: place.lng,
            category: place.category
          })
        }
    });

    this.placeQuery.selectLoading()
    .pipe(takeUntil(this.destroy$))
    .subscribe((isLoading) => {
      this.isBusy = isLoading;
      if (this.isBusy){
        this.form.disable();
      }
      else {
        this.form.enable();
      }
    });

    this.placeQuery.selectError().pipe(
      takeUntil(this.destroy$)).subscribe((err) => {
        if (!err){
          this.error = null;
          return;
        }

        this.error = err.message || "Unknown Error";
      });

    this.placeQuery.location$().pipe(
      takeUntil(this.destroy$),
      catchError(this.handleError.bind(this))
    ).subscribe(location => {
      if (!location || !location.lat || !location.lng) return;
      this.location = location;

      this.mapsService.geocode(location).pipe(
        takeUntil(this.destroy$),
        catchError(this.handleError.bind(this))
      ).subscribe((results: any) => {
        if (results && results.results && results.results.length) {

          const address : Record<string, string> = {}
        
          results.results[0].address_components.map((addressComponent:any) => {
            const types = addressComponent.types.join(',');
            address[types] = addressComponent.short_name;
          });
  

          this.defaultAddress = {
            zip: address['postal_code'] || "",
            city: address['locality,political'] || "",
            state: address['administrative_area_level_1,political'] || "",
          };

          this.form.patchValue({
            city: this.defaultAddress.city,
            state: this.defaultAddress.state,
            country: this.defaultAddress.country,
            zip: this.defaultAddress.zip
          });
          
        }
    });
    })
  }

  public clearForm(e: any){
    e.preventDefault();
    this.placeService.activatePlace(null);
    this.form.reset();
    this.form.patchValue({
      city: this.defaultAddress.city,
      state: this.defaultAddress.state,
      country: this.defaultAddress.country,
      zip: this.defaultAddress.zip
    });

  }

  public onSubmit(form: FormGroup): void {
    if (this.isBusy) return;
    form.markAllAsTouched();
    if (!form.valid) return;


    if (this.activePlace == null){
      this.placeService.add(form.value).pipe(
        take(1),
        takeUntil(this.destroy$),
        catchError(this.handleError.bind(this))
      ).subscribe();
      this.form.reset();
    }
    else {
      this.placeService.update(this.activePlace.id, {...this.activePlace, ...this.form.value}).pipe(
        take(1),
        takeUntil(this.destroy$),
        catchError(this.handleError.bind(this))
      ).subscribe();
      this.form.reset();
    }
  }

  handleError(err : any){
    this.placeService.setError(err);
    return of(err);
  }

  public suggestNearbyListing(e : any) {
    e.preventDefault();
    this.placeService.setIsLoading(true);
    this.mapsService.suggest(this.location, this.form.value.name, this.form.value.category).pipe(
      take(1),
      takeUntil(this.destroy$),
      finalize(() => this.placeService.setIsLoading(false)),
      catchError(this.handleError.bind(this))).subscribe((results : any) => {

        this.suggestedPlaces = results.results.map((result : any) => {
          return {
            placeId: result.place_id,
            name: result.name,
            address: result.vicinity
          }
        })

        this.showNearbyListings = true;
      });
  }

  public addSuggestedListing(e : any, place : SuggestedPlace) {
    e.preventDefault();
    this.placeService.setIsLoading(true);
    this.mapsService.getPlaceDetails(place.placeId).pipe(
      take(1),
      takeUntil(this.destroy$),
      finalize(() => this.placeService.setIsLoading(false)),
      catchError(this.handleError.bind(this))).subscribe((results : any) => {

        const address : Record<string, string> = {}
        
        results.address_components.map((addressComponent:any) => {
          const types = addressComponent.types.join(',');
          address[types] = addressComponent.short_name;
        });

        const name = results.name;
        const lat = results.geometry.location.lat;
        const lng = results.geometry.location.lng;
        const address1 = `${address['street_number'] || ""} ${address['route'] || ""}`.trim();
        const address2 = address['subpremise'] || "";
        const city = address['locality,political'] || "";
        const state = address['administrative_area_level_1,political'] || "";
        const zip = address['postal_code'] || "";

        this.form.patchValue({
          name: name,
          lat: lat,
          lng: lng,
          address1: address1,
          address2: address2,
          city: city,
          state: state,
          zip: zip
        });

      });

      this.showNearbyListings = false;
  }

  public closeNearbyListing(e : any){
    e.preventDefault();
    this.showNearbyListings = false;
    this.suggestedPlaces = [];
  }

  public clearError(e : any){
    e.preventDefault();
    this.placeService.clearError();
  }
}
