import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router , NavigationEnd, Event } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { UrlService } from '../../Services/url.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  loginForm!: FormGroup;
  imageProfileURL:string ='';
  previousUrl: Observable<string> = this.urlService.previousUrl$;
  previousUrlValue: string = '';

  constructor(private router: Router, 
    private fb: FormBuilder, 
    private authService: AuthService, 
    private toastr : ToastrService, 
    private location : Location,
    private urlService: UrlService) {
  }
  
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })

    this.urlService.previousUrl$.subscribe((previousUrl: string) => {
      console.log('previous url: ', previousUrl);
      this.previousUrlValue = previousUrl;
    });
  }

  HideShow() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  goBack() {
    if (this.previousUrlValue.includes('/register')) {
      this.router.navigate(['']);
    } else {
      this.location.back();
    }
  }

  GetProfilePhoto() {
    const user = this.authService.getUserInfoFromToken();
    if (user && user.website) {
      const imageProfileURL = user.website;
      return imageProfileURL;
  }}

  OnLogin() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value)
      this.authService.login(this.loginForm.value)
        .subscribe({
          next: (res:any) => {
            console.log(res.token)
            this.toastr.success('Success', 'Logged in successfully!');
            this.authService.storeToken(res.token)
            this.imageProfileURL= this.GetProfilePhoto()
            this.goBack()
            if(this.imageProfileURL){
              this.router.navigate([''])
            }
            if(!this.imageProfileURL){
              this.router.navigate(['/addphoto'])
            }  
            this.loginForm.reset()
          },
          error: (err:any) => {
            console.log(err?.error.message);
            this.toastr.error('Error', 'Email or Password are incorrect !');
          }
        })
    }
    else {
      this.validateAllFormFields(this.loginForm)
      this.toastr.error('Error', 'Form is Invalid');
    }
  }

  private validateAllFormFields(formgroup: FormGroup) {
    Object.keys(formgroup.controls).forEach(field => {
      const control = formgroup.get(field)
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true })
      }
      else if (control instanceof FormGroup) {
        this.validateAllFormFields(control)
      }
    })
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToHome() {
    this.router.navigate(['']);
  }

  
}
