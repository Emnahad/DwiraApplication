import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private toastr : ToastrService) {
    this.contactForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if(this.authService.isLoggedIn()){
      if (this.contactForm.valid) {
        const contactMessage = this.contactForm.value;
        this.authService.sendContactMessage(contactMessage).subscribe(
          () => {
            this.toastr.success('Success', 'Your message was successfully sent');
            console.log('Contact message sent successfully');
           
            this.contactForm.reset();
          },
          (error:any) => {
            console.error('Error sending message:', error);
          }
        );
      } else {
        this.markFormGroupTouched(this.contactForm);
      }
    }
    else {
      this.router.navigate(['/login'])
      this.toastr.error('Error', 'To contact us you need to login');
    }
    
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
