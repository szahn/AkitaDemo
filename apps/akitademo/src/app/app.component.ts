import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';
import { PlaceQuery } from '../core/place/place-entity.query';

@Component({
  selector: 'akitademo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  
  public title = 'My Favorite Places';
  public isBusy: boolean = false;
  protected readonly destroy$: Subject<void> = new Subject();

  constructor(private placeQuery: PlaceQuery) {

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  ngOnInit(): void {
    this.placeQuery.selectLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading) => {
        this.isBusy = isLoading;
      });
  }
}
