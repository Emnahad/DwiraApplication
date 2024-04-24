import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../../Services/admin.service';
import { Loisirs } from '../../Models/Loisirs';
import { GuestHouse } from '../../Models/GuestHouse.Model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  guestHouses : GuestHouse[]=[];
  originalGuestHouses: GuestHouse[]=[];
  cities: string[] = [];
  guestHousesSlide: { name: string, localization: string, photoLink: string }[] = [
    { name: 'Dar El Gaïed El Maâmouri', localization: 'Hammamet, Nabeul, Tunisia', photoLink: '../../../assets/first.jpg' },
    { name: 'Dar la vie est belle', localization: 'Salakta, Mahdia, Tunisia', photoLink: '../../../assets/second.jpg' },
    { name: 'Le Foret bleu', localization: 'Cap Blanc, Bizerte, Tunisia', photoLink: '../../../assets/third.jpg' },
    { name: 'Dar Zaghouene', localization: 'Zaghouene, Tunisia', photoLink: '../../../assets/fourth.jpg' }
  ];
  currentIndex: number = 0;
  interval: any;
  loisirs: Loisirs[] = [];
  send: boolean = false;
  nbpersons: number = 0;
  city : string = '';
  depDate : string = '';
  arrDate : string = '';
  

  constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit(): void {
    this.startSlideShow();
    this.getAllLoisirs();
    this.getAllGuestHouses();
  }

  loadNbVisitors(event:any){
    const element = event.target.value;
    const elementType = event.target.type;
    if (elementType =='number'){
      const numberValue = parseInt(element, 10);
        if (!isNaN(numberValue)) {
          this.nbpersons = numberValue;
        }
    }
  }

  loadCity(event:any){
    const element = event.target.value;
    this.city=element;
  }

  loadDateDep(event:any){
    const element = event.target.value;
    this.depDate=element;
  }

  loadDateArr(event:any){
    const element = event.target.value;
    this.arrDate=element;
  }

  sendData(){
    this.send = true;
    this.router.navigate(
      ['/searchPage'],
      { queryParams: {
        city : this.city,
        nbpersons :this.nbpersons,
        send : this.send}
      }
      )
  }

  startSlideShow(): void {
    this.interval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.guestHousesSlide.length; }, 4000);
  }

  setCurrentIndex(index: number): void {
    this.currentIndex = index;
  }
  
  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  getAllGuestHouses(): void {
    this.adminService.getAllGuestHouses().subscribe(
      (allGuestHouses: GuestHouse[]) => {
        this.guestHouses = allGuestHouses;
        this.originalGuestHouses = this.guestHouses;
        this.cities = Array.from(new Set(this.guestHouses.map(guestHouse => guestHouse.city))).filter(city => city !== null) as string[];
      }
    );
  }

  getAllLoisirs() {
    this.adminService.getAllLoisirs().subscribe(
      {
        next: (loisirs) => {
          this.loisirs = loisirs;
        },
        error: (response) => {
          console.log(response);
        }
      }
    )
  }

  goToCarte(){
    this.router.navigate(['/carte'])
  }

}
