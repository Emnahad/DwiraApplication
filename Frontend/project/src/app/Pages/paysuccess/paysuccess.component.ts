import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GuestHouse } from '../../Models/GuestHouse.Model';
import { AdminService } from '../../Services/admin.service';

@Component({
  selector: 'app-paysuccess',
  templateUrl: './paysuccess.component.html',
  styleUrl: './paysuccess.component.css'
})
export class PaysuccessComponent {
  constructor(private route: ActivatedRoute, private adminService: AdminService) { }
  formattedDate1: string | undefined;
  formattedDate2: string | undefined;
  guestHouse: GuestHouse | null = null;
  totalPrice: number | undefined;
  userEmail: string | undefined;
  userCardNumber: string | undefined;
  userExpiryDate: string | undefined;
  departureDate: string | undefined;
  arrivalDate: string | undefined;
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.formattedDate1 = params['formattedDate1'];
      this.formattedDate2 = params['formattedDate2'];
      this.departureDate = params['departureDate'];
      this.arrivalDate = params['arrivalDate'];
      const guestHouseId = params['guestHouseId'];
      const totalPrice = params['totalPrice'];
      this.userEmail = params['userEmail'];
      this.userCardNumber = params['userCardNumber'];
      this.userExpiryDate = params['userExpiryDate'];

      this.totalPrice = totalPrice;
      console.log(guestHouseId);
      if (guestHouseId) {
        this.adminService.getItemById(guestHouseId).subscribe(
          (guestHouse: GuestHouse) => {
            console.log('Guest house data:', guestHouse);
            this.guestHouse = guestHouse;
            this.updateAvailableDates(guestHouse);
            console.log(guestHouse.availableDates)

          },
          (error) => {
            console.log('Error fetching guest house data:', error);
          }
        );
      }
    });
  }
  updateAvailableDates(guestHouse: GuestHouse): void {
    console.log(this.arrivalDate);
    if (this.departureDate && this.arrivalDate) {
      const departureDateObj = new Date(this.departureDate);
      const arrivalDateObj = new Date(this.arrivalDate);
      const reservedDates = this.getDatesInRange(departureDateObj, arrivalDateObj)
        .map(date => date.toISOString().split('T')[0]); // Convert dates to strings in "YYYY-MM-DD" format

      // Convert existing availableDates to strings in "YYYY-MM-DD" format
      const existingAvailableDates = new Set<string>(guestHouse.availableDates ?
        guestHouse.availableDates.map(date => date.toString().split('T')[0]) :
        []);

      reservedDates.forEach(date => existingAvailableDates.add(date));

      guestHouse.availableDates = [...existingAvailableDates];

      console.log(guestHouse.availableDates);
      this.adminService.updateItem(guestHouse.id, guestHouse).subscribe(
        updatedGuestHouse => {
          if (updatedGuestHouse) {
            console.log('Guest house available dates updated successfully:', updatedGuestHouse);
          } else {
            console.error('Error: Update operation returned null.');
          }
        },
        error => {
          console.error('Error updating guest house available dates:', error);
        }
      );
      console.log(guestHouse.availableDates);
    }
  }


  getDatesInRange(startDate: Date, endDate: Date): Date[] {
    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    console.log(dates);
    return dates;

  }
}