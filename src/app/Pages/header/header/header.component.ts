import { Component } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isMenuOpen = false;
  profilePhotoURL: string = '';
  loggedIn : boolean = false;

  constructor(private authService: AuthService, private router: Router) { 
    this.IsLoggedIn();
  }
  
  ngOnInit(): void {
    this.profilePhotoURL = this.GetProfilePhoto();
    this.loggedIn = this.authService.isLoggedIn();
  }
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.IsLoggedIn();
  }

  GetProfilePhoto() {
    this.IsLoggedIn();
    const user = this.authService.getUserInfoFromToken();
    if (user && user.website) {
      const imageProfileURL = user.website;
      return imageProfileURL;
    
    }}

  GoToLogin(){
    this.router.navigate(['/login'])
    this.IsLoggedIn();
  }

  GoToProfile(){
    this.router.navigate(['/profile'])
    this.IsLoggedIn();
  }

  GoToHome(){
    this.router.navigate(['']);
    this.IsLoggedIn();
  }

  GoToLog(){
    this.router.navigate(['/searchPage']);
    this.IsLoggedIn();
  }

  Logout(){
    this.authService.clearToken()
    this.router.navigate(['/login'])
    this.IsLoggedIn();
  }

  IsLoggedIn(){
    this.loggedIn = this.authService.isLoggedIn()
  }
}