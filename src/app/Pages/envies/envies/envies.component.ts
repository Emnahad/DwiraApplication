import { Component } from '@angular/core';
import { GuestHouse } from '../../../Models/GuestHouse.Model';
import { AdminService } from '../../../Services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Loisirs } from '../../../Models/Loisirs';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-envies',
  templateUrl: './envies.component.html',
  styleUrls: ['./envies.component.css']
})
export class EnviesComponent {
  guestHouses: GuestHouse[] = [];
  selectedIndexes: number[] = []; 
  loisirs: Loisirs[] = [];
  selectedLoisir: Loisirs | null = null; 
  selectedLoisirName: string = '';
  loggedIn : boolean = false;
  originalGuestHouses: GuestHouse[] = [];
  constructor(private adminService: AdminService, private router: Router,
    private route: ActivatedRoute, private authService: AuthService) { }
    
  navigateToHome() {
    this.router.navigate(['']);
    this.IsLoggedIn();
  }

  IsLoggedIn(){
    this.loggedIn = this.authService.isLoggedIn()
  }

  navigateToGuestInfo(guestHouseId: string) {
    this.router.navigate(['/guestinfo', guestHouseId]);
  }

  ngOnInit(): void {
    this.getAllGuestHouses();
    this.getAllLoisirs();
    this.route.params.subscribe(params => {
      this.selectedLoisirName = params['nameL'];
      this.getAllGuestHouses();
    });
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

  filterGuestHouses(selectedLoisir: Loisirs): void {
    this.selectedLoisir = selectedLoisir;
    this.guestHouses = [...this.originalGuestHouses];

    this.guestHouses = this.guestHouses.filter(guestHouse => {
      return guestHouse.keywords.some(keyword => keyword.toLowerCase().includes(selectedLoisir.nameL.toLowerCase()));
    });
  }

  isLoisirSelected(loisir: Loisirs): boolean {
    return this.selectedLoisir === loisir;
  }
  
  getAllGuestHouses(): void {
    this.adminService.getAllGuestHouses().subscribe(guestHouses => {
      this.originalGuestHouses = guestHouses;
      if (this.selectedLoisirName) {
        const selectedLoisir = this.loisirs.find(loisir => loisir.nameL === this.selectedLoisirName);
        if (selectedLoisir) {
          this.filterGuestHouses(selectedLoisir);
        }
      } else {
        this.guestHouses = guestHouses;
      }
      this.selectedIndexes = new Array(guestHouses.length).fill(0);
    });
  }

  // Method to select the image by index for a specific card
  selectImage(index: number, cardIndex: number): void {
    this.selectedIndexes[cardIndex] = index;
  }
}

