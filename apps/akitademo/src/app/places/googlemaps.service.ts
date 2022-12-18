import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
  })
export class GoogleMapsService {
    
    constructor(private httpClient: HttpClient) {

    }

    public geocode(location : {lat : number, lng : number}) {
        return this.httpClient.get(`/api/geocode?lat=${location.lat}&lng=${location.lng}`);
    }

    public suggest(location : {lat : number, lng : number}, keyword : string, type: string) {
        return this.httpClient.get(`/api/suggest?lat=${location.lat}&lng=${location.lng}&type=${type}`);
    }

    public getPlaceDetails(placeId: string) { 
        return this.httpClient.get(`/api/placeDetails?placeId=${placeId}`);
    }
}