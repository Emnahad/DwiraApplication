import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GuestHouse } from '../Models/GuestHouse.Model';
import { Loisirs } from '../Models/Loisirs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private BACKEND_URL = 'http://localhost:5295/api';

  constructor(private http: HttpClient) { }
  
  getAllGuestHouses(): Observable<GuestHouse[]> {
    return this.http.get<GuestHouse[]>(`${this.BACKEND_URL}/GuestHouse`);
  }
  
  getItemById(Id: string): Observable<GuestHouse> {
    return this.http.get<GuestHouse>(`${this.BACKEND_URL}/GuestHouse/${Id}`);
  }
 
  createItem(itemData: GuestHouse): Observable<GuestHouse> {
    return this.http.post<GuestHouse>(`${this.BACKEND_URL}/GuestHouse`, itemData);
  }
 
  updateItem(Id: string, updatedItemData: GuestHouse): Observable<GuestHouse> {
    return this.http.put<GuestHouse>(`${this.BACKEND_URL}/GuestHouse/${Id}`, updatedItemData);
  }
  
  deleteItem(Id: number): Observable<any> {
    return this.http.delete<any>(`${this.BACKEND_URL}/GuestHouse/${Id}`);
  }

  getAllLoisirs(): Observable<Loisirs[]> {
    return this.http.get<Loisirs[]>(`${this.BACKEND_URL}/Loisirs`);
  }

  updateloisir(Idl: string, updatedItemData: Loisirs): Observable<Loisirs> {
    return this.http.put<Loisirs>(`${this.BACKEND_URL}/Loisirs/${Idl}`, updatedItemData);
  }

  createLoisir(itemData: Loisirs): Observable<Loisirs> {
    return this.http.post<Loisirs>(`${this.BACKEND_URL}/Loisirs`, itemData);
  }
 
  deleteLoisir(Id: number): Observable<any> {
    return this.http.delete<any>(`${this.BACKEND_URL}/Loisirs/${Id}`);
  }

}
