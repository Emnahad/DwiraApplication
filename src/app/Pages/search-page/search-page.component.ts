import { Component } from '@angular/core';
import { GuestHouse } from '../../Models/GuestHouse.Model';
import { AdminService } from '../../Services/admin.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Loisirs } from '../../Models/Loisirs';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})
export class SearchPageComponent {
  loisirs: Loisirs[] = [];
  selectedLoisirs: Loisirs[] = [];
  filteredGuestHouses: GuestHouse[] = [];
  guestHouses: GuestHouse[] = [];
  originalGuestHouses: GuestHouse[] = [];
  selectedOption: string = '';
  nbpersons = ['1-10', '11-20', '21-30', '+30'];
  cities: string[] = [];
  allCities: (string | null)[] = [];
  selectedCities: string[] = [];
  selectedIndex: number = -1;
  send: boolean = false;
  nb: number = 0;
  city : string = '';

  constructor(private adminService: AdminService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getAllGuestHouses();
    this.getAllLoisirs();
  }

  isWithinRange(number: number, min: number, max: number): boolean {
    return number >= min && number <= max;
  }

  getQuery(){
    this.city = this.route.snapshot.queryParams['city']
    this.nb = this.route.snapshot.queryParams['nbpersons']
    this.send = this.route.snapshot.queryParams['send']
    console.log('city: ', this.city, ',visitors: ',this.nb)

    if(this.send){
      this.guestHouses = this.originalGuestHouses.filter(guestHouse =>{
        return this.city == guestHouse.city && ( this.nb == guestHouse.nb_person || this.isWithinRange(this.nb, guestHouse.nb_person - 5, guestHouse.nb_person + 5))
      })
    } else {
      this.guestHouses = this.originalGuestHouses
    }
  }  

  resetFilters(){
    this.selectedCities = [];
    this.selectedLoisirs = [];
    this.selectedOption = '';
    this.applyFilters();
  }

  applyFilters() {
    if (this.selectedCities.length === 0 && this.selectedLoisirs.length === 0 && !this.selectedOption) {
        this.guestHouses = this.originalGuestHouses;
    } else {
        this.guestHouses = this.originalGuestHouses.filter(guestHouse => {
            const loisirFilter = this.selectedLoisirs.length === 0 ||
                this.selectedLoisirs.some(selectedLoisir => {
                    const keywordsArray = guestHouse.keywords[0].split(',').map(keyword => keyword.trim());
                    return keywordsArray.some(keyword => keyword.toLowerCase().includes(selectedLoisir.nameL.toLowerCase()));
                });

            const cityFilter = this.selectedCities.length === 0 ||
                this.selectedCities.includes(guestHouse.city || '');

            const nbPersonFilter = !this.selectedOption ||
                (this.selectedOption === '1-10' && guestHouse.nb_person >= 1 && guestHouse.nb_person <= 10) ||
                (this.selectedOption === '11-20' && guestHouse.nb_person >= 11 && guestHouse.nb_person <= 20) ||
                (this.selectedOption === '21-30' && guestHouse.nb_person >= 21 && guestHouse.nb_person <= 30) ||
                (this.selectedOption === '+30' && guestHouse.nb_person > 30);

            return loisirFilter && cityFilter && nbPersonFilter;
        });
    }
  }

  updateSelectedLoisirs(event: Event, loisir: Loisirs) {
    if (event.target instanceof HTMLInputElement) {
        const checked = event.target.checked;
        if (checked) {
            this.selectedLoisirs.push(loisir);
        } else {
            const index = this.selectedLoisirs.indexOf(loisir);
            if (index !== -1) {
                this.selectedLoisirs.splice(index, 1);
            }
        }
        this.applyFilters();
    }
}

  updateSelectedCities(event: Event, city: string | null) {
    if (city !== null){
      if (event.target instanceof HTMLInputElement) {
        const checked = event.target.checked;
        if (checked) {
            this.selectedCities.push(city);
        } else {
            const index = this.selectedCities.indexOf(city);
            if (index !== -1) {
                this.selectedCities.splice(index, 1);
            }
        }
        this.applyFilters();
    }
    }
  }

  filterVisitors(nb: string, index: number) {
    if (this.selectedOption === nb) {
        this.selectedOption = '';
    } else {
        this.selectedIndex = index;
        this.selectedOption = nb;
    }
    this.applyFilters();
}

  navigateToGuestInfo(guestHouseId: string) {
    this.router.navigate(['/guestinfo', guestHouseId]);
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

  getAllGuestHouses(): void {
    this.adminService.getAllGuestHouses().subscribe(
      (allGuestHouses: GuestHouse[]) => {
        this.guestHouses = allGuestHouses;
        this.originalGuestHouses = this.guestHouses;
        this.getQuery();
        this.cities = Array.from(new Set(this.guestHouses.map(guestHouse => guestHouse.city))).filter(city => city !== null) as string[];
        this.allCities = Array.from(new Set(this.originalGuestHouses.map(guestHouse=> guestHouse.city)))
      }
    );
  }
}
