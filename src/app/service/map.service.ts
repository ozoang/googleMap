import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MapService {
    googlemapApiKey = 'AIzaSyBhStf0tP88vYUXIR0t7GpEaVkmrf2LKx4';


    constructor(
        private http: HttpClient
    ) { }

    private _apiLoaded = false;
    private geoCoder: google.maps.Geocoder;
    private _isApiLoading = false;

    loadApi(): BehaviorSubject<boolean> {
        const subject$ = new BehaviorSubject<boolean>(false);
        if (this._apiLoaded) {
            subject$.next(true);
        } else if (!this._isApiLoading) {
            this._isApiLoading = true;
            this.http.jsonp(`https://maps.googleapis.com/maps/api/js?libraries=places&key=${this.googlemapApiKey}`, 'callback')
                .pipe(
            ).subscribe(r => {
                this._apiLoaded = true;
                this.geoCoder = new google.maps.Geocoder();
                subject$.next(true);
            })
        }
        return subject$;
    }
}