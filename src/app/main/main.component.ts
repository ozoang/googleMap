import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapDirectionsService } from '@angular/google-maps';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { DialogService } from '../service/dialog.service';
import { mapService } from '../service/map.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  // @ViewChild('drawer') drawer: ElementRef;
  directionsResults$: Observable<google.maps.DirectionsResult|undefined>;

  filterProduct = '';
  myLocation: any = { value: '' };
  locations: any[] = [{ value: '' }];

  startLatLng = {};
  locationLatLng: any[] = [];


  currentPosition: google.maps.LatLngLiteral;
  centerPosition: google.maps.LatLngLiteral;
  apiLoaded: BehaviorSubject<boolean>;
  waypts: google.maps.DirectionsWaypoint[] = [];

  constructor(
    private dialog: DialogService,
    private mapDirectionsService: MapDirectionsService,
    private ggmService: mapService
  ) { }

  ngOnInit(): void {
    this.apiLoaded = this.ggmService.loadApi();
    this.direction()
  }

  clearProduct(): void {
    this.filterProduct = '';
  }

  clearFilter(): void {
    this.filterProduct = '';
  }

  addLocation(): void {
    if (this.locations.length < 10) {
      this.locations.push({ value: '' });
    } else {
      alert('ใส่จำนวนสถานที่ได้มากที่สุด 10 แห่ง');
    }
    console.log('onadd ', this.locations.length);
  }

  submit(): void {
    if (!this.myLocation.value) return alert('ไม่มีสถานที่เริ่มต้น');
    if (!this.locations.length) return alert('ไม่มีสถานที่เป้าหมาย');
    // this.startLatLng = (this.myLocation.value.split(','));
    this.locationLatLng = [];
    for (let i = 0; i < this.locations.length; i++) {
      this.locationLatLng.push({lat:Number(this.locations[i].value.split(',')[0]),lng:Number(this.locations[i].value.split(',')[1])});
      console.log('locatoin value', this.locations[i].value)
      this.waypts.push({
        location: this.locations[i].value,
        stopover: true,
      })
    }
    //13.903863781122176, 100.52815158963804
    console.log('startlatlng > ', this.startLatLng);
    console.log('latlng > ', this.locationLatLng);
    console.log('start > ', this.myLocation.value.split(',')[0], '==', this.myLocation.value.split(',')[1]);

    this.currentPosition = { lat: Number(this.myLocation.value.split(',')[0]), lng: Number(this.myLocation.value.split(',')[1]) }
    this.centerPosition = { lat: Number(this.myLocation.value.split(',')[0]), lng: Number(this.myLocation.value.split(',')[1]) }
    // this.calculateAndDisplayRoute(directionsService, directionsRenderer);
    this.ngOnInit();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    this.apiLoaded.subscribe({
      next: (loaded) => {
        if (!loaded) return;
        // ทำอะไรเกี่ยวกับแผนที่ที่นี่
        console.log(loaded);
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



  // initMap(): void {
  //   const directionsService = new google.maps.DirectionsService();
  //   const directionsRenderer = new google.maps.DirectionsRenderer();
  //   const map = new google.maps.Map(
  //     document.getElementById("map") as HTMLElement,
  //     {
  //       zoom: 6,
  //       center: { lat: 13.908168, lng: 100.531501 },
  //     }
  //   );

  //   directionsRenderer.setMap(map);

  //   (document.getElementById("submit") as HTMLElement).addEventListener(
  //     "click",
  //     () => {
  //       this.calculateAndDisplayRoute(directionsService, directionsRenderer);
  //     }
  //   );
  // }

  calculateAndDisplayRoute(
    directionsService: google.maps.DirectionsService,
    directionsRenderer: google.maps.DirectionsRenderer
  ) {
    const waypts: google.maps.DirectionsWaypoint[] = [];
    const checkboxArray = document.getElementById(
      "waypoints"
    ) as HTMLSelectElement;

    for (let i = 0; i < checkboxArray.length; i++) {
      if (checkboxArray.options[i].selected) {
        waypts.push({
          location: (checkboxArray[i] as HTMLOptionElement).value,
          stopover: true,
        });
      }
    }

    directionsService
      .route({
        origin: (document.getElementById("start") as HTMLInputElement).value,
        destination: (document.getElementById("end") as HTMLInputElement).value,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);

        const route = response.routes[0];
        const summaryPanel = document.getElementById(
          "directions-panel"
        ) as HTMLElement;

        summaryPanel.innerHTML = "";

        // For each route, display summary information.
        for (let i = 0; i < route.legs.length; i++) {
          const routeSegment = i + 1;

          summaryPanel.innerHTML +=
            "<b>Route Segment: " + routeSegment + "</b><br>";
          summaryPanel.innerHTML += route.legs[i].start_address + " to ";
          summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
          summaryPanel.innerHTML += route.legs[i].distance!.text + "<br><br>";
        }
      })
      .catch((e) => window.alert("Directions request failed due to " + status));
  }
}
