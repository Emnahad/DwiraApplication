import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GuestHouse } from '../Models/GuestHouse.Model';
import { Loisirs } from '../Models/Loisirs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'https://localhost:7000/api';

  constructor(private http: HttpClient) { }
  
  getAllGuestHouses(): Observable<GuestHouse[]> {
    return this.http.get<GuestHouse[]>(`${this.apiUrl}/GuestHouse`);
  }
  
  getItemById(Id: string): Observable<GuestHouse> {
    return this.http.get<GuestHouse>(`${this.apiUrl}/GuestHouse/${Id}`);
  }
 
  createItem(itemData: GuestHouse): Observable<GuestHouse> {
    return this.http.post<GuestHouse>(`${this.apiUrl}/GuestHouse`, itemData);
  }
 
  updateItem(Id: string, updatedItemData: GuestHouse): Observable<GuestHouse> {
    return this.http.put<GuestHouse>(`${this.apiUrl}/GuestHouse/${Id}`, updatedItemData);
  }
  
  deleteItem(Id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/GuestHouse/${Id}`);
  }

  getAllLoisirs(): Observable<Loisirs[]> {
    return this.http.get<Loisirs[]>(`${this.apiUrl}/Loisirs`);
  }

  updateloisir(Idl: string, updatedItemData: Loisirs): Observable<Loisirs> {
    return this.http.put<Loisirs>(`${this.apiUrl}/Loisirs/${Idl}`, updatedItemData);
  }

  createLoisir(itemData: Loisirs): Observable<Loisirs> {
    return this.http.post<Loisirs>(`${this.apiUrl}/Loisirs`, itemData);
  }
 
  deleteLoisir(Id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Loisirs/${Id}`);
  }

}
