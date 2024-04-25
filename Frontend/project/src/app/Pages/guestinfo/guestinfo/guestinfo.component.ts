import { Component, OnInit, Renderer2} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GuestHouse } from '../../../Models/GuestHouse.Model';
import { AdminService } from '../../../Services/admin.service';
import { AuthService } from '../../../Services/auth.service';
import { Location } from '@angular/common';
import { MatCalendarCellClassFunction, MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-guestinfo',
  templateUrl: './guestinfo.component.html',
  styleUrls: ['./guestinfo.component.css']
})
export class GuestinfoComponent implements OnInit {
  guestHouse: GuestHouse | null = null;
  
  liked: boolean = false;
  departureDate: string | undefined;
  arrivalDate: string | undefined;
  numberOfTravelers: number | undefined;
  new_rate: number | undefined;
  totalPrice: number | undefined;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private authService: AuthService,
    private location: Location,  
    private toaster: ToastrService,  
  ) { }

  ngOnInit(): void {
    const guestHouseId = this.route.snapshot.paramMap.get('id');
    if (guestHouseId) {
      this.getGuestHouse(guestHouseId);
    }
  }

  getGuestHouse(guestHouseId: string) {
    this.adminService.getItemById(guestHouseId).subscribe(
      (guestHouse: GuestHouse) => {
        this.guestHouse = guestHouse;
        if (this.guestHouse && this.guestHouse.availableDates) {
          this.guestHouse.availableDates = this.guestHouse.availableDates.map(date => date.toString().split('T')[0]);
        }
        console.log('Available Dates:', this.guestHouse.availableDates);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  goBack() {
    this.location.back()
  }

  toggleLike() {
    if (this.authService.isLoggedIn()) {
      if (this.guestHouse?.ratingGlobal !== null && this.guestHouse !== null) {
        console.log(this.guestHouse.ratingGlobal)
        this.liked = !this.liked;
        if (this.liked) {
          this.guestHouse.ratingGlobal++;
        } else {
          this.guestHouse.ratingGlobal--;
        }
        const updatedGuestHouse: GuestHouse = { ...this.guestHouse };
        this.adminService.updateItem(updatedGuestHouse.id, updatedGuestHouse)
          .subscribe(updatedItem => {
            console.log('rating updated successfully:', updatedItem);
          }, error => {
            console.error('Error updating reting', error);
          });
      }
    }
    else {
      this.toaster.error('Error', 'To like a guesthouse you need to login')
    }
  }

  calculateTotal(): number {
    let totalPrice = 0; 
    if (!this.departureDate || !this.arrivalDate || !this.numberOfTravelers || !this.guestHouse) {
      return 0;
    }
    const departureDateObj = new Date(this.departureDate);
    const arrivalDateObj = new Date(this.arrivalDate);
    const numberOfDays = Math.ceil((arrivalDateObj.getTime() - departureDateObj.getTime()) / (1000 * 3600 * 24));
    console.log(numberOfDays)
    console.log(this.numberOfTravelers)
    totalPrice = (this.guestHouse.pricePerday || 0) * numberOfDays * this.numberOfTravelers;
    return totalPrice; 
  }

  Reserver() {
    if (!this.departureDate || !this.arrivalDate || !this.numberOfTravelers || !this.guestHouse) {
      this.toaster.warning('Warning', 'Please fill in all the fields.')
      return;
    }

    const departureDateObj = new Date(this.departureDate);
    const arrivalDateObj = new Date(this.arrivalDate);

    if (departureDateObj >= arrivalDateObj) {
      this.toaster.warning('Warning', 'Departure date must be before arrival date.')
      return;
    }
    if (this.numberOfTravelers < 0) {
      this.toaster.warning('Warning', 'Number of travelers cannot be negative.')
      return;
    }

    const currentDate = new Date();
    if (departureDateObj < currentDate) {
      this.toaster.warning('Warning', 'Departure date must be after the current date.')
      return;
    }

    if (this.authService.isLoggedIn()) {
      const selectedDates = this.getDatesInRange(departureDateObj, arrivalDateObj);
      const reservedDates = this.guestHouse.availableDates?.map(dateStr => new Date(dateStr)) || [];

      // Check if any of the selected dates are already reserved
      const overlappingDates = selectedDates.filter(date => reservedDates.some(reservedDate => this.isSameDate(date, reservedDate)));
      if (overlappingDates.length > 0) {
        this.toaster.warning('Warning', 'One or more selected dates are already reserved.')
        return;
      }

      if (this.numberOfTravelers < 0) {
        this.toaster.warning('Warning', 'Number of travelers cannot be negative.')
        return;
      }
      if (this.numberOfTravelers > this.guestHouse.nb_person) {
        this.toaster.warning('Warning', 'NThe number selected exceeds the guesthouse capacity.')
        return;
      }

      const totalAmount = this.calculateTotal();
      if (totalAmount === 0) {
        this.toaster.warning('Warning', 'Total amount is zero. Please choose valid dates.')
        return;
      }
      this.router.navigate(['/payment'], {
        queryParams: {
          amount: totalAmount,
          id: this.guestHouse.id,
          departureDate: this.departureDate,
          arrivalDate: this.arrivalDate,
          numberOfTravelers: this.numberOfTravelers,
          totalPrice: totalAmount
        }
      });
      console.log('first step of reservation is done')
    } else {
      this.toaster.error('Error','To book a holiday you need to login' )
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

  isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
    return date >= startDate && date <= endDate;
  }


  isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

  dateClass(): MatCalendarCellClassFunction<Date> {
    return (date: Date): MatCalendarCellCssClasses => {
      if (this.guestHouse && this.guestHouse.availableDates) {
        // Convert availableDates to Date objects
        const availableDates = this.guestHouse.availableDates.map(dateStr => new Date(dateStr));
        return availableDates.some(d => this.isSameDate(d, date)) ? 'highlighted-date' : '';
      }
      return '';
    };
  }


}