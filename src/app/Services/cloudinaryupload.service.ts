import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CloudinaryuploadService {
  uploadPreset = 'nibtvkme'; 
  cloudName = 'photoscloud';
  constructor(private http: HttpClient) { }
  uploadImage(vals: any): Observable<any> {
    let data = vals;
    console.log(data.get("file"));
    return this.http.post('https://api.cloudinary.com/v1_1/dyycgxqzw/image/upload', data)
  }
  uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    return this.http.post<any>(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, formData);
  }
}