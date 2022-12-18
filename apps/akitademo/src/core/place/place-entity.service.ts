import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, finalize, take, tap } from "rxjs";
import { PlaceModel } from "./place-entity.model";
import { PlaceStore } from "./place-entity.store";

@Injectable({ providedIn: 'root' })
export class PlaceService {

    constructor(private store : PlaceStore, private httpClient: HttpClient){

    }

    public activatePlace(place : PlaceModel | null){
        this.store.setActive( place ? place.id : null);
    }

    public add(place : PlaceModel) {
        this.store.setLoading(true);
        return this.httpClient.post('/api/place', place).pipe(
            tap((response : any) => this.store.add(response)),
            catchError((err : any) => {
                this.store.setError(err)
                throw err;
            }),
            finalize(() => this.store.setLoading(false))
        );
    }

    public get() {
        this.store.setLoading(true);
        return this.httpClient.get('/api/places').pipe(
            tap((response : any) => this.store.set(response)),
            catchError((err : any) => {
                this.store.setError(err)
                throw err;
            }),
            finalize(() => this.store.setLoading(false))
        );
    }

    public delete(placeId: string) {
        this.store.setLoading(true);
        return this.httpClient.delete(`/api/place/${placeId}`).pipe(
            tap((response : any) => this.store.remove(placeId)),
            catchError((err : any) => {
                this.store.setError(err)
                throw err;
            }),
            finalize(() => this.store.setLoading(false))
        );
    }

    public update(placeId : string, place : PlaceModel) {
        this.store.setLoading(true);
        return this.httpClient.put(`/api/place/${placeId}`, place).pipe(
            tap((response : any) => {
                this.store.update(placeId, response);
            }),
            catchError((err : any) => {
                this.store.setError(err)
                throw err;
            }),
            finalize(() => this.store.setLoading(false))
        );
    }

    public clearError(){
        this.store.setError(null);
    }

    public setError(err : Error) {
        console.error(err);
        this.store.setError(err);
    }

    public setIsLoading(isLoading : boolean) {
        this.store.setLoading(isLoading);
    }

    public setLocation(location: {lat : number, lng : number}): void {
        const hasLocation = location != null && location.lat != 0 && location.lng != 0;
        this.store.ui.update({ location: location, hasLocation: hasLocation });
    }

}