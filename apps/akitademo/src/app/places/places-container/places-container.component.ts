import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlaceService } from 'apps/akitademo/src/core/place/place-entity.service';
import { catchError, finalize, of, Subject, take, takeUntil, throwError } from 'rxjs';

@Component({
  selector: 'places-container',
  templateUrl: './places-container.component.html',
  styleUrls: ['./places-container.component.scss'],
})
export class PlacesContainerComponent implements OnInit, OnDestroy {

  protected readonly destroy$: Subject<void> = new Subject();

  constructor(private placeService : PlaceService){}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnInit(): void {
    this.detectLocation(null);

    this.placeService.setIsLoading(true);
    this.placeService.get().pipe(
      take(1),
      takeUntil(this.destroy$),
      finalize(() => this.placeService.setIsLoading(false)),
      catchError(this.handleError.bind(this)))
      .subscribe();
  }

  private detectLocation(fallbackLocation : any) : void {
    if (fallbackLocation != null){
      this.placeService.setLocation(fallbackLocation);
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          this.placeService.setLocation(location);

        },
        () => this.handleError(new Error("Failed to get location"))
      );
    } else {
      this.handleError(new Error("Location detection not supported"));
    }    
  }

  private handleError(error : Error) {
    this.placeService.setError(error);
    return of(error);
  }

}
