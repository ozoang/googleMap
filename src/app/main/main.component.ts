import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapDirectionsRenderer, MapDirectionsService } from '@angular/google-maps';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { DialogService } from '../service/dialog.service';
import { MapService } from '../service/map.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  // @ViewChild('drawer') drawer: ElementRef;
  directionsResults$: Observable<google.maps.DirectionsResult|undefined>;

  myLocation: any = { value: '' };
  locations: any[] = [{ value: '' }];

  locationLatLng: any[] = [];


  currentPosition: google.maps.LatLngLiteral;
  centerPosition: google.maps.LatLngLiteral;
  apiLoaded: BehaviorSubject<boolean>;
  waypts: google.maps.DirectionsWaypoint[] = [];

  constructor(
    private mapDirectionsService: MapDirectionsService,
    // private mapDirectionsRender: MapDirectionsRenderer,
    private mapService: MapService
  ) { }

  ngOnInit(): void {
    this.apiLoaded = this.mapService.loadApi();
    this.direction()
  }

  addLocation(): void {
    if (this.locations.length < 10) {
      this.locations.push({ value: '' });
    } else {
      alert('ใส่จำนวนสถานที่ได้มากที่สุด 10 แห่ง');
    }
    console.log('onadd ', this.locations.length);
  }

  removeInput(index:number): void{
    this.locations.splice(index,1);
  }

  submit(): void {
    if (!this.myLocation.value) return alert('ไม่มีสถานที่เริ่มต้น');
    if (!this.locations.length) return alert('ไม่มีสถานที่เป้าหมาย');
    
    this.locationLatLng = [];
    this.waypts = [];
    for (let i = 0; i < this.locations.length; i++) {
      // this.locationLatLng.push({lat:Number(this.locations[i].value.split(',')[0]),lng:Number(this.locations[i].value.split(',')[1])});
      this.waypts.push({
        location: this.locations[i].value,
        stopover: true,
      })
    }

    //13.903863781122176, 100.52815158963804
    this.currentPosition = { lat: Number(this.myLocation.value.split(',')[0]), lng: Number(this.myLocation.value.split(',')[1]) }
    this.centerPosition = { lat: Number(this.myLocation.value.split(',')[0]), lng: Number(this.myLocation.value.split(',')[1]) }
    this.ngOnInit();
    // let panel = this.mapDirectionsRender.getPanel();
    // console.log(panel)
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
      origin: this.currentPosition,
      destination: this.currentPosition,
      waypoints: this.waypts,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING
    };
    this.directionsResults$ = this.mapDirectionsService.route(request).pipe(map(response => response.result));
  }
}
