import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class Service{

    private apiUrl = 'http://localhost:3000';

    constructor(
        private http: HttpClient
    ) { }

    getLatLng(store:string): Observable<any> {
        let params = new HttpParams()
          .set('storeId', store.toString())

        return this.http.get(this.apiUrl + '/getLatLng', { params: params });
    }

}