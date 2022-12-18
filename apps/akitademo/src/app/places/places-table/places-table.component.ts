import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlaceModel } from 'apps/akitademo/src/core/place/place-entity.model';
import { PlaceQuery } from 'apps/akitademo/src/core/place/place-entity.query';
import { PlaceService } from 'apps/akitademo/src/core/place/place-entity.service';
import { catchError, finalize, of, Subject, take, takeUntil, throwError } from 'rxjs';
import {findIndex} from 'lodash';

@Component({
  selector: 'places-table',
  templateUrl: './places-table.component.html',
  styleUrls: ['./places-table.component.scss'],
})
export class PlacesTableComponent implements OnInit, OnDestroy {

  public places : PlaceModel[] = [];
  public activePlace : PlaceModel | null = null;
  protected readonly destroy$: Subject<void> = new Subject();

  constructor(private placeQuery: PlaceQuery, private placeService : PlaceService) {

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.placeQuery.selectAll().pipe(
      takeUntil(this.destroy$),
      catchError(this.handleError.bind(this)))
      .subscribe((places : PlaceModel[]) => {
        this.places = places;
    });

    this.placeQuery.selectActive().pipe(
      takeUntil(this.destroy$))
      .subscribe((place : PlaceModel | undefined) => {
        this.activePlace = place ?  place : null;
    });
  }

  deletePlace(e : any) {
    e.preventDefault();

    const placeId : string = e.currentTarget.attributes['data-place-id'].value;
    const index : number = findIndex(this.places, ['id', placeId]);
    const place = this.places[index];

    this.placeService.delete(place.id).pipe(
      take(1),
      takeUntil(this.destroy$),
      catchError(this.handleError.bind(this))).subscribe();
  }

  editPlace(e : any) {
    e.preventDefault();


    const placeId = e.currentTarget.attributes['data-place-id'].value;
    const index : number = findIndex(this.places, (p : PlaceModel) => p.id == placeId);
    const place = this.places[index];

    this.placeService.activatePlace(place);
  }

  refresh(e : any)
  {
    e.preventDefault();
    this.placeService.get().pipe(
      takeUntil(this.destroy$),
      catchError(this.handleError.bind(this)))
      .subscribe();
  }

  handleError(err : any){
    this.placeService.setError(err);
    return of(err);
  }


}
