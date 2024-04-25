import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './Pages/admin/admin/admin.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Correct import for animations
import { MatTableModule } from '@angular/material/table';
import { HomeComponent } from './Pages/home/home.component';
import { HeaderComponent } from './Pages/header/header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { EnviesComponent } from './Pages/envies/envies/envies.component';
import { GuestinfoComponent } from './Pages/guestinfo/guestinfo/guestinfo.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LoginComponent } from './Pages/login/login.component';
import { RegisterComponent } from './Pages/register/register.component';
import { AddphotoComponent } from './Pages/addphoto/addphoto.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactComponent } from './Pages/contact/contact.component';
import { ProfileComponent } from './Pages/profile/profile.component';
import { CarteComponent } from './Pages/carte/carte.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { SearchPageComponent } from './Pages/search-page/search-page.component';
import { ToastrModule } from 'ngx-toastr';
import { FooterComponent } from './Pages/footer/footer.component';
import { PaymentComponent } from './Pages/payment/payment.component';
import { PaysuccessComponent } from './Pages/paysuccess/paysuccess.component';


@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    HomeComponent,
    HeaderComponent,
    EnviesComponent,
    GuestinfoComponent,
    LoginComponent,
    RegisterComponent,
    AddphotoComponent,
    ContactComponent,
    ProfileComponent,
    CarteComponent,
    SearchPageComponent,
    FooterComponent,
    PaymentComponent,
    PaysuccessComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxDropzoneModule,
    HttpClientModule,
    BrowserAnimationsModule, 
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    FormsModule,
    LeafletModule,
    ToastrModule.forRoot(),
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
