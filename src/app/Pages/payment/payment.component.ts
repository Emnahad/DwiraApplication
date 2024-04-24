import { Component, ElementRef, ViewChild } from '@angular/core';
import { PaymentService } from '../../Services/payment.service';
import { ActivatedRoute, Router } from '@angular/router'; // Import ActivatedRoute and Router
import { HttpClient } from '@angular/common/http';
import { AdminService } from '../../Services/admin.service';
import { GuestHouse } from '../../Models/GuestHouse.Model';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  constructor(private http: HttpClient, 
    private route: ActivatedRoute, 
    private adminService: AdminService, 
    private paymentService: PaymentService, 
    private router: Router,
    private location:Location,
    private toaster: ToastrService,

  ) { } 
  handler: any = null;
  date1: string | undefined;
  date2: string | undefined;
  guestHouse: GuestHouse | null = null; 
  departureDate: string | undefined;
  arrivalDate: string | undefined;
  formattedDate1: string | undefined;
  formattedDate2: string | undefined;
  numberOfTravelers: number | undefined;
  totalPrice: number | undefined;
  userEmail: string = '';
  userCardNumber: string = '';
  userExpiryDate: string = '';
  userCvv: string = '';
  ngOnInit(): void {
    this.loadStripe();
    this.route.queryParams.subscribe(params => {
      const guestHouseId = params['id'];
      const departureDate = params['departureDate'];
      const arrivalDate = params['arrivalDate'];
      const numberOfTravelers = params['numberOfTravelers'];
      const totalPrice = params['totalPrice'];
      if (guestHouseId) {
        this.getGuestHouse(guestHouseId);
      }
      this.totalPrice = totalPrice;
      console.log(totalPrice)
      if (departureDate && arrivalDate) {
        this.departureDate = departureDate;
        this.arrivalDate = arrivalDate;
        console.log(departureDate);
        this.numberOfTravelers = numberOfTravelers;
        const date1 = new Date(departureDate);
        const options = { day: "numeric", month: "long" } as Intl.DateTimeFormatOptions;
        const formattedDate1 = date1.toLocaleDateString("fr-FR", options);
        this.formattedDate1 = formattedDate1;
        const date2 = new Date(arrivalDate);
        const options1 = { day: "numeric", month: "long" } as Intl.DateTimeFormatOptions;
        const formattedDate2 = date2.toLocaleDateString("fr-FR", options1);
        this.formattedDate2 = formattedDate2;
      }
    });
  }

  goBack() {
    this.location.back()
  }

  calculatePeriod(): number {
    const departureDate = this.route.snapshot.queryParamMap.get('departureDate');
    const arrivalDate = this.route.snapshot.queryParamMap.get('arrivalDate');
    // Perform null checks
    if (departureDate && arrivalDate) {
      console.log(new Date(arrivalDate).getTime());

      const period = new Date(arrivalDate).getTime() - new Date(departureDate).getTime();
      // Convert milliseconds to days
      return Math.ceil(period / (1000 * 60 * 60 * 24));
    } else {
      return 0; 
    }
  }

  getGuestHouse(guestHouseId: string) {
    this.adminService.getItemById(guestHouseId).subscribe(
      (guestHouse: GuestHouse) => {
        this.guestHouse = guestHouse;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  pay(amount: number) { 
    const guestHouseId = this.route.snapshot.queryParamMap.get('id');
    console.log('Guest house ID:', guestHouseId);
    if (guestHouseId !== null) {
      var handler = (<any>window).StripeCheckout.configure({
        key: 'pk_test_51OzOfN2Loml2Ho8kwyYcJ4e5oXflilQWnyH4RSwGuYdv86qFJ50SjwUiBLyxT3YkkSw5cWxGsRL2PMEQiVtSBcSo003eL4snlV',
        locale: 'auto',
        token: (token: any) => {
          console.log(token);
          this.getGuestHouseAndSendToken(token, guestHouseId as string); 
        }
      });

      handler.open({
        name: 'Demo Site',
        description: '2 widgets',
        amount: amount * 100
      });
    } else {
      console.error('Guest house ID not found.');
    }
  }


  getGuestHouseAndSendToken(token: object, guestHouseId: string) {
    this.adminService.getItemById(guestHouseId).subscribe(
      (guestHouse: GuestHouse) => {
        if (guestHouse && guestHouse.pricePerday) {
          const amount = guestHouse.pricePerday;
          console.log(amount); 
          this.sendTokenToBackend(token, amount, guestHouseId);
        } else {
          console.error('Guest house not found or invalid pricePerday.');
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  sendTokenToBackend(token: any, amount: number, guestHouseId: string) {
    // Extract user information from the token object
    this.userEmail = token.email || '';
    this.userCardNumber = token.card.last4 || ''; 
    console.log(this.userCardNumber);
    console.log(this.userEmail);
    this.userExpiryDate = token.card.exp_month + '/' + token.card.exp_year || ''; 
    console.log(this.userExpiryDate);
    this.paymentService.processPayment(guestHouseId, token.id, amount).subscribe(
      response => {
        console.log(response);
        this.toaster.success('Success', 'Payment Success !')
        this.router.navigate(['/paysuccess'], {
          queryParams: {
            formattedDate1: this.formattedDate1,
            formattedDate2: this.formattedDate2,
            departureDate: this.departureDate,
            arrivalDate:this.arrivalDate,
            guestHouseId: guestHouseId,
            totalPrice: this.totalPrice,
            userEmail: this.userEmail,
            userCardNumber: this.userCardNumber,
            userExpiryDate:this.userExpiryDate
          }
        });
      },
      error => {
        console.error('Error:', error);
        this.toaster.error('Error', 'Payment Failed. Please Try Again')
      }
    );
  }


  loadStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const s = window.document.createElement('script');
      s.id = 'stripe-script';
      s.type = 'text/javascript';
      s.src = 'https://checkout.stripe.com/checkout.js';
      s.onload = () => {
        this.handler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51OzOfN2Loml2Ho8kwyYcJ4e5oXflilQWnyH4RSwGuYdv86qFJ50SjwUiBLyxT3YkkSw5cWxGsRL2PMEQiVtSBcSo003eL4snlV',
          locale: 'auto',
          token: (token: any) => {
          }
        });
      };
      window.document.body.appendChild(s);
    }
  }

}