import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CloudinaryuploadService } from '../../Services/cloudinaryupload.service';
import { User } from '../../Models/User';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-addphoto',
  templateUrl: './addphoto.component.html',
  styleUrl: './addphoto.component.css'
})
export class AddphotoComponent {
  profileImage: File | null = null;
  user: User[] = [];

  constructor(
    private router: Router,
    private upload: CloudinaryuploadService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    const user = this.authService.getUserInfoFromToken();
    console.log('User:', user);
    if (user) {
      const userId = user.nameid;
      console.log('User ID:', userId);
    } else {
      console.error('User not found or invalid token');
    }
  }

  onSelect(event: any) {
    if (event && event.addedFiles && event.addedFiles.length > 0) {
      const file: File = event.addedFiles[0];
      this.profileImage = file;
    }
  }

  onRemove() {
    this.profileImage = null;
  }

  getAllUsers() {
    this.authService.getAllUsers().subscribe(
      {
        next: (user) => {
          this.user = user;
        },
        error: (response:any) => {
          console.log(response);
        }
      }
    );
  }

  OnUpload() {
    if (this.profileImage) {
      this.upload.uploadPhoto(this.profileImage).subscribe(
        (response: any) => {
          console.log('Upload successful:', response);
          console.log('response Url', response.url)
          this.updateProfileImage(response.url);
          this.router.navigate(['']);
          this.authService.getUserInfoFromToken();
        },
        (error: any) => {
          console.error('Upload error:', error);
        }
      );
    } else {
      console.log('No image selected.');
    }
  }

  updateProfileImage(imageUrl: string) {
    const user = this.authService.getUserInfoFromToken();
    const userId = user.nameid;
    console.log('user id to update', userId);
    this.authService.updateProfileImage(userId, imageUrl).subscribe(
      (response:any) => {
        console.log('Profile image updated successfully:', response);
        alert('Profile image updated successfully.');
      },
      (error:any) => {
        console.error('Failed to update profile image:', error);
        alert('Failed to update profile image. Please try again.');
      }
    );
  }

  goToHome() {
    this.router.navigate(['']);
  }

}
