import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { User } from '../Models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private BACKEND_URL: string = "http://localhost:5295/api/User";

  constructor(private http: HttpClient) { }
  visited: boolean = false;

  register(registerObj: any) {
    return this.http.post<any>(`${this.BACKEND_URL}/register`, registerObj);
  }

  login(loginObj: any) {
    return this.http.post<any>(`${this.BACKEND_URL}/authenticate`, loginObj);
  }

  updateProfileImage(userId: string, imageUrl: string): Observable<any> {
    return this.http.put<any>(`${this.BACKEND_URL}/${userId}/profile-image`, { imageUrl });
  }


  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.BACKEND_URL}`);
  }

  getUserInfoFromToken(): any {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const jwtData = token.split('.')[1];
          const decodedJwt = JSON.parse(atob(jwtData));
          console.log(decodedJwt);
          return decodedJwt;

        } catch (e) {
          console.error('Error decoding JWT:', e);
          return null;
        }
      } else {
        return null;
      }
    }
  }

  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue)
  }

  clearToken(): void {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  sendContactMessage(contactMessage: any): Observable<string> {
    return this.http.post(`${this.BACKEND_URL}/contact`, contactMessage, { responseType: 'text' })
      .pipe(
        catchError((error: any) => {
          let errorMessage: string;
          if (error instanceof HttpResponse) {
            try {
              errorMessage = error.body; // Get the plain text response
            } catch (e) {
              errorMessage = 'An error occurred while processing the request.';
            }
          } else {
            errorMessage = 'An error occurred while making the request.';
          }
          return throwError(errorMessage);
        })
      );
  }

  setVisited() {
    this.visited = true;
  }

  hasVisited(): boolean {
    return this.visited;
  }

  updateToken(newTokenValue: string): void {
    localStorage.setItem('token', newTokenValue);
  }
}

