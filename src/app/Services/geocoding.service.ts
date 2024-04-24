import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

  constructor(private http: HttpClient) { }
  
  private apiKey = 'pk.db19a9c8d959e0feb6ccb1e952815475';

  getLocation(query: string, limit: number = 5): Observable<any> {
    const apiUrl = `https://api.locationiq.com/v1/autocomplete?key=${this.apiKey}&q=${encodeURIComponent(query)}&limit=${limit}&dedupe=1`;
    return this.http.get(apiUrl);
  }

}
