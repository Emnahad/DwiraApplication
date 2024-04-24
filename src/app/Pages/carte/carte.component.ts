import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { GeocodingService } from '../../Services/geocoding.service';
import { AdminService } from '../../Services/admin.service';
import { GuestHouse } from '../../Models/GuestHouse.Model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carte',
  templateUrl: './carte.component.html',
  styleUrls: ['./carte.component.css']
})
export class CarteComponent implements OnInit {

  map: any;
  guestHouses: GuestHouse[] = [];
  originalGuestHouses:GuestHouse[]=[];
  markers: L.Marker[] = [];
  smallIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
    iconSize:    [25, 41],
    iconAnchor:  [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize:  [41, 41]
  });

  constructor(
    private geocodingService: GeocodingService,
    private adminService: AdminService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllGuestHouses();
  }

  createMap(latitude: number, longitude: number): void {
    if (!this.map) {
      latitude = 36.8065;
      longitude = 10.1815;
      this.map = L.map('map', {
        center: [latitude, longitude],
        zoom: 12
      });

      const mainLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 8,
        maxZoom: 17,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });
      mainLayer.addTo(this.map);

      this.map.on('moveend', () => {
        const bounds = this.map.getBounds();
        const visibleMarkers = this.markers.filter(marker => bounds.contains(marker.getLatLng()));
        const visibleMarkerNames = visibleMarkers
            .map(marker => marker.getPopup())
            .map(popup => popup!.getContent())
            .filter(name => typeof(name) === 'string') as string[];
        console.log('visibleMarkers are :', visibleMarkerNames);
        console.log('type of visible markers is :', typeof(visibleMarkerNames));
        this.movementFilter(visibleMarkerNames);
    });
      this.map.on('click',()=>{
        this.guestHouses=this.originalGuestHouses;
      });
    }
  }

  movementFilter(visibleMarkerNames: string[]): void {
    const lowerCaseMarkerNames = visibleMarkerNames.map(name => name.toLowerCase());
    this.guestHouses = this.originalGuestHouses.filter(guestHouse => 
        lowerCaseMarkerNames.includes(guestHouse.name.toLowerCase())
    );
}

  addMarker(latitude: number, longitude: number, name:string): void {
    const marker = L.marker([latitude, longitude], { icon: this.smallIcon }).addTo(this.map);
    marker.bindPopup(name)
    marker.on('click', () => {
      this.guestHouses=this.originalGuestHouses;
      this.clickFilter(name)
    });
    this.markers.push(marker);
  }

  clickFilter(nameGuest: string): void {
    this.guestHouses = this.guestHouses.filter(guestHouse => guestHouse.name === nameGuest);
  }

  getAddressGeolocation(address: string, name: string): void {
    this.geocodingService.getLocation(address, 5).subscribe(
      (data: any) => {
        if (data && data[0]) {
          const latitude = parseFloat(data[0].lat);
          const longitude = parseFloat(data[0].lon);
          console.log('Latitude of',name, 'is', latitude);
          console.log('Longitude of',name, 'is', longitude);
          this.createMap(latitude, longitude);
          this.addMarker(latitude, longitude, name);
        } else {
          console.log('No geolocation data found for the address:', address);
        }
      },
      (error) => {
        console.error('Error fetching geolocation for the address:',address, error);
      }
    );
  }

  getAllGuestHouses(): void {
    this.adminService.getAllGuestHouses().subscribe(
      (allGuestHouses: GuestHouse[]) => {
        this.guestHouses = allGuestHouses;
        console.log('Our GuestHouses are:', this.guestHouses);
        this.originalGuestHouses = this.guestHouses;
        console.log('Guesthouses are stored on the variable for filter', this.originalGuestHouses);
        this.guestHouses.forEach((guestHouse: GuestHouse, index:number) => {
          if (guestHouse.location && guestHouse.name) {
            const location = guestHouse.location;
            setTimeout(() => {
              this.getAddressGeolocation(location, guestHouse.name);
            }, index*2000); 
          }
        });
      },
      error => {
        console.error('Error fetching guest houses:', error); 
      }
    );
  }

  navigateToGuestInfo(guestHouseId: string) {
    this.router.navigate(['/guestinfo', guestHouseId]);
  }
}