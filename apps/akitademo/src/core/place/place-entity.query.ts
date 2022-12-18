import { Injectable } from "@angular/core";
import { PlaceState, PlaceStore } from "./place-entity.store";
import { Order, QueryConfig, QueryEntity } from '@datorama/akita';
import { Observable } from "rxjs";
import { PlacesUIModel } from "./place-entity-ui.model";

@Injectable({ providedIn: 'root' })
@QueryConfig({
    sortBy: 'name',
    sortByOrder: Order.ASC
})
export class PlaceQuery extends QueryEntity<PlaceState> {

    constructor(protected override store : PlaceStore) {
        super(store);
        this.createUIQuery();
    }

    public location$: () => Observable<PlacesUIModel['location']> = () => this.ui.select<{lat : number, lng : number}>((state: PlacesUIModel) => state['location']);
    public hasLocation$: () => Observable<PlacesUIModel['hasLocation']> = () => this.ui.select<boolean>((state: PlacesUIModel) => state['hasLocation']);

}