import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../Models/Payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }
  
  processPayment(guestHouseId: string, tokenId: string, amount: number): Observable<any> {
    return this.http.post<Payment>(`http://localhost:5295/api/GuestHouse/${guestHouseId}/processPayment`, { tokenId,amount });
  }
}
