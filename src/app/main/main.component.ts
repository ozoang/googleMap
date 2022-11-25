import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapDirectionsService } from '@angular/google-maps';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { MapService } from '../service/map.service';
import { Service } from '../service/service';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  directionsResults$: Observable<google.maps.DirectionsResult | undefined>;
  myLocation: any = { value: '' };
  storeLocation: any = { value: '' };
  locations: any[] = [{ value: '' }];

  locationLatLng: any[] = [];

  currentPosition: google.maps.LatLngLiteral;
  centerPosition: google.maps.LatLngLiteral;
  apiLoaded: BehaviorSubject<boolean>;
  waypts: google.maps.DirectionsWaypoint[] = [];

  isStoreId = false;

  constructor(
    private mapDirectionsService: MapDirectionsService,
    private mapService: MapService,
    private service: Service
  ) { }

  ngOnInit(): void {

    this.apiLoaded = this.mapService.loadApi();
    this.direction();
  }

  addLocation(): void {
    if (this.locations.length < 10) {
      this.locations.push({ value: '' });
    } else {
      alert('ใส่จำนวนสถานที่ได้มากที่สุด 10 แห่ง');
    }
  }

  removeInput(index: number): void {
    this.locations.splice(index, 1);
  }

  submit(): void {
    const latLngRegEx = /^[-+]?([1-8]?\d(.\d+)?|90(.0+)?),\s*[-+]?(180(.0+)?|((1[0-7]\d)|([1-9]?\d))(.\d+)?)$/;
    const storeIdRegEx = /^[0-9]*$/;
    if (!this.myLocation.value.trim()) return alert('ไม่มีสถานที่เริ่มต้น');
    if (this.locations[0].value.trim() == '') return alert('ไม่มีสถานที่เป้าหมาย');

    if (storeIdRegEx.test(this.myLocation.value.trim())) {
      this.isStoreId = true;

    } else if (!latLngRegEx.test(this.myLocation.value.trim())) {

      return alert('กรุณากรอก latitude, longitude เป็นตัวเลข')
    } else { this.isStoreId = false; };

    this.locations.find(locationLatLng => {
      if (!latLngRegEx.test(locationLatLng.value.trim())) return alert('กรุณากรอก latitude, longitude เป็นตัวเลข');
    })

    this.locationLatLng = [];
    this.waypts = [];
    for (let i = 0; i < this.locations.length; i++) {
      this.waypts.push({
        location: this.locations[i].value,
        stopover: true,
      })
    }

    //13.903863781122176, 100.52815158963804

    if (this.isStoreId) {
      this.service.getLatLng(this.myLocation.value).subscribe(res => {
        if (res.error) {
          alert(res.error);
        }
        this.storeLocation.value = res.result.lat + ',' + res.result.lng;
        this.currentPosition = { lat: Number(this.storeLocation.value.split(',')[0]), lng: Number(this.storeLocation.value.split(',')[1]) }
        this.centerPosition = { lat: Number(this.storeLocation.value.split(',')[0]), lng: Number(this.storeLocation.value.split(',')[1]) }
        this.ngOnInit();
      })
    } else {
      this.currentPosition = { lat: Number(this.myLocation.value.split(',')[0]), lng: Number(this.myLocation.value.split(',')[1]) }
      this.centerPosition = { lat: Number(this.myLocation.value.split(',')[0]), lng: Number(this.myLocation.value.split(',')[1]) }
      this.ngOnInit();
    }

  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    this.apiLoaded.subscribe({
      next: (loaded) => {
        if (!loaded) return;
      }
    });
  }

  direction() {
    const request: google.maps.DirectionsRequest = {
      origin: this.currentPosition ? this.currentPosition : '',
      destination: this.currentPosition ? this.currentPosition : '',
      waypoints: this.waypts,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING
    };
    this.directionsResults$ = this.mapDirectionsService.route(request).pipe(map(response => response.result));
  }

}
