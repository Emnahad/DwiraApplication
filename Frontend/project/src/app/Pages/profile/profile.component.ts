import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { CloudinaryuploadService } from '../../Services/cloudinaryupload.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})


export class ProfileComponent {
  constructor(private authService: AuthService, private upload: CloudinaryuploadService, private toastr : ToastrService) { }

  profilePhotoURL: string = '';
  firstname: string ='';
  lastname: string ='';
  email: string= '';
  profileImage: File | null = null;
  
  defaultProfilePhotoURL : string ='../../../assets/profile.png'

  ngOnInit(): void {
    this.profilePhotoURL = this.GetProfilePhoto();
    this.email=this.GetEmail();
    this.lastname=this.GetLastName();
    console.log(this.lastname)
    this.firstname=this.GetFirstName();
    console.log(this.firstname)
  }

  GetProfilePhoto() {
    const user = this.authService.getUserInfoFromToken();
    if (user && user.website) {
      const imageProfileURL = user.website;
      return imageProfileURL;
  }}

  GetLastName() {
    const user = this.authService.getUserInfoFromToken();
    if (user && user.family_name) {
      const lastname = user.family_name;
      return lastname;
  }}

  GetFirstName() {
    const user = this.authService.getUserInfoFromToken();
    if (user && user.given_name) {
      const firstname = user.given_name;
      return firstname;
  }}

  GetEmail() {
    const user = this.authService.getUserInfoFromToken();
    if (user && user.email) {
      const email = user.email;
      return email;
  }}

  onSelect(event: any) {
    if (event && event.target.files && event.target.files.length > 0) {
      const file: File = event.target.files[0];
      console.log('File selected:', file);
      this.profileImage = file;
    }
  }
  
  OnUpload() {
    if (this.profileImage) {
      console.log('Uploading image:', this.profileImage);
      this.upload.uploadPhoto(this.profileImage).subscribe(
        (response: any) => {
          console.log('Upload successful:', response);
          console.log('Response Url', response.url);
          this.updateProfileImage(response.url);
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
    console.log('User id to update:', userId);
    this.authService.updateProfileImage(userId, imageUrl).subscribe(
      (response: any) => {
        console.log('Profile image updated successfully:', response);
        this.toastr.success('Success', 'Profile image updated successfully');
      },
      (error: any) => {
        console.error('Failed to update profile image:', error);
        this.toastr.error('Error', 'Failed to update profile image. Please try again');
      }
    );
    }
}
