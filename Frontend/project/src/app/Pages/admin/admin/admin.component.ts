import { Component } from '@angular/core';
import { CloudinaryuploadService } from '../../../Services/cloudinaryupload.service';
import { AdminService } from '../../../Services/admin.service';
import { GuestHouse } from '../../../Models/GuestHouse.Model';
import { Loisirs } from '../../../Models/Loisirs';
import {User} from '../../../Models/User';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  guestHouses: GuestHouse[] = [];
  displayedColumnsUsers: string[] = ['firstName', 'lastName', 'email'];
  displayedColumns: string[] = ['name', 'keywords', 'availableDates', 'city', 'location', 'pricePerday', 'description', 'dragDrop'];
  loisirs: Loisirs[] = [];
  Users : User[] = [];
  guestHouseFiles: { [key: string]: File[] } = {};
  welcome : boolean = true;
  showGuestHouseTable: boolean = false;
  showUsersTable: boolean = false;
  showLoisirTable: boolean = false;
  selectedLoisirFile: { [key: string]: File }={} ;

  constructor(private upload: CloudinaryuploadService, private adminService: AdminService, private authService : AuthService) { }

  onSelect(guestHouse: GuestHouse, event: any) {
    this.guestHouseFiles[guestHouse.id] = event.addedFiles;
    console.log(this.guestHouseFiles[guestHouse.id]);
  }

  onSelectLoisirFile(loisirs:Loisirs,event: any) {
    this.selectedLoisirFile[loisirs.idl] = event.addedFiles[0];
    console.log(this.selectedLoisirFile);
  }

  onRemove(removedFile: File) {
    Object.keys(this.guestHouseFiles).forEach(guestHouseId => {
      const index = this.guestHouseFiles[guestHouseId].indexOf(removedFile);
      if (index !== -1) {
        this.guestHouseFiles[guestHouseId].splice(index, 1);
        console.log('File removed:', removedFile);
        return;
      }
    });
  }

  uploadFiles() {
    this.guestHouses.forEach(guestHouse => {
      const files = this.guestHouseFiles[guestHouse.id];
      if (files && files.length > 0) {
        files.forEach(file => {
          const data = new FormData();
          data.append('file', file);
          data.append('upload_preset', 'uutthl8k');
          data.append('cloudname', 'dyycgxqzw');
          this.upload.uploadImage(data).subscribe(
            (res) => {
              guestHouse.imageUrls.push(res.url);
              this.adminService.updateItem(guestHouse.id, guestHouse).subscribe(
                (updatedGuestHouse: GuestHouse) => {
                  console.log("Guest house updated with image:", updatedGuestHouse);
                },
                (error: any) => {
                  console.error("Error updating guest house:", error);
                }
              );
            },
            (error: any) => {
              console.error("Error uploading image:", error);
            }
          );
        });
      }
    });
    this.loisirs.forEach(loisir => {
      const file = this.selectedLoisirFile[loisir.idl];
      console.log(file);
      if (file && file.size > 0) {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'uutthl8k');
        data.append('cloudname', 'dyycgxqzw');
        this.upload.uploadImage(data).subscribe(
          (res) => {
            loisir.imageUrl = res.url;
            console.log("Loisir file uploaded:", res.url);
            this.adminService.updateloisir(loisir.idl, loisir).subscribe(
              (updatedloisir: Loisirs) => {
                console.log("loisir updated with image:", updatedloisir);
              },
              (error: any) => {
                console.error("Error updating loisir:", error);
              }
            );
          },
          (error: any) => {
            console.error("Error uploading Loisir file:", error);
          }
        );
      }
    })
  };

  ngOnInit(): void {
    this.getAllUsers();
    this.getAllGuestHouses();
    this.getAllLoisirs();
  }

  getAllGuestHouses() {
    this.adminService.getAllGuestHouses().subscribe(
      {
        next: (guestHouses) => {
          this.guestHouses = guestHouses;
        },
        error: (response) => {
          console.log(response);
        }
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

  getAllUsers(){
    this.authService.getAllUsers().subscribe(
      {
        next: (Users) => {
          this.Users = Users;
          console.log(Users)
        },
        error: (response) => {
          console.log(response)
        }
      }
    )
  }

  showGuestHouses() {
    this.showGuestHouseTable = true;
    this.showLoisirTable = false;
    this.showUsersTable = false;
    this.welcome = false;
  }

  showLoisirs() {
    this.showGuestHouseTable = false;
    this.showLoisirTable = true;
    this.showUsersTable= false;
    this.welcome = false;
  }

  showUsers(){
    this.showGuestHouseTable = false;
    this.showLoisirTable = false;
    this.showUsersTable= true;
    this.welcome = false;
  }
}

