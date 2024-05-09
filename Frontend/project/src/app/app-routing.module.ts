import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { EnviesComponent } from './Pages/envies/envies/envies.component';
import { AdminComponent } from './Pages/admin/admin/admin.component';
import { GuestinfoComponent } from './Pages/guestinfo/guestinfo/guestinfo.component';
import { LoginComponent } from './Pages/login/login.component';
import { RegisterComponent } from './Pages/register/register.component';
import { AddphotoComponent } from './Pages/addphoto/addphoto.component';
import { ContactComponent } from './Pages/contact/contact.component';
import { ProfileComponent } from './Pages/profile/profile.component';
import { CarteComponent } from './Pages/carte/carte.component';
import { SearchPageComponent } from './Pages/search-page/search-page.component';
import { PaymentComponent } from './Pages/payment/payment.component';
import { PaysuccessComponent } from './Pages/paysuccess/paysuccess.component';

const routes: Routes = [
  {path: '', component: HomeComponent },
  {path: 'envies', component: EnviesComponent },
  {path: 'admin', component: AdminComponent },
  {path: 'envies/:nameL', component: EnviesComponent },
  {path: 'guestinfo', component: GuestinfoComponent },
  {path : "login", component:LoginComponent},
  {path : "register", component:RegisterComponent},
  {path : "addphoto", component:AddphotoComponent},
  {path: 'guestinfo/:id', component: GuestinfoComponent },
  {path: "contact", component: ContactComponent },
  {path: "profile", component: ProfileComponent },
  {path: "carte", component: CarteComponent },
  {path: "searchPage", component : SearchPageComponent},
  { path: "payment", component: PaymentComponent },
  { path: "paysuccess", component: PaysuccessComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
