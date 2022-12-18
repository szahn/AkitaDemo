import { Injectable } from '@angular/core';
import { ActiveState, EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { PlacesUIModel } from './place-entity-ui.model';
import { PlaceModel } from './place-entity.model';

export type PlaceUIState = EntityState<PlacesUIModel>;
export interface PlaceState extends EntityState<PlaceModel, string | undefined>, ActiveState{};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'place' })
export class PlaceStore extends EntityStore<PlaceState> {
  public constructor() {
    super();

    this.createUIStore({
      entityName: 'Place',
      isFormDirty : false,
      location: {lat: null, lng: null},
      hasLocation: false,
      active: null
    });
  }
}
