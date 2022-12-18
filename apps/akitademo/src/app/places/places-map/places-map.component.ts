import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlaceModel } from 'apps/akitademo/src/core/place/place-entity.model';
import { PlaceQuery } from 'apps/akitademo/src/core/place/place-entity.query';
import { PlaceService } from 'apps/akitademo/src/core/place/place-entity.service';
import { catchError, of, Subject, take, takeUntil, throwError } from 'rxjs';

@Component({
  selector: 'places-map',
  templateUrl: './places-map.component.html',
  styleUrls: ['./places-map.component.scss'],
})
export class PlacesMapComponent implements OnInit, OnDestroy {

  protected hasLocation :boolean = false;

  protected zoom = 14;
  protected center: google.maps.LatLngLiteral = {lat: 0, lng: 0};

  public markers : any[] = [];
  protected readonly destroy$: Subject<void> = new Subject();

  constructor(private query : PlaceQuery, private placeService : PlaceService) {
    
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.query.hasLocation$().pipe(
      takeUntil(this.destroy$),
      catchError(this.handleError.bind(this))).subscribe((hasLocation) => {
        this.hasLocation = hasLocation;
    });

    this.query.location$().pipe(
      takeUntil(this.destroy$),
      catchError(this.handleError.bind(this))).subscribe((location) => {
        this.center = {lat: location.lat, lng: location.lng}
    });

    this.query.selectAll().pipe(
      takeUntil(this.destroy$),
      catchError(this.handleError.bind(this))).subscribe((places : PlaceModel[]) => {
        this.markers = places.map((place) => {
          return {position: {lat: place.lat, lng: place.lng}, title: place.name}
        });
    });
  }

  handleError(err : any){
    this.placeService.setError(err);

    return of(err);
  }


}
