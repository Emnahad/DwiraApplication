// app.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from './Services/auth.service';
import { filter } from 'rxjs/operators';
import { Router , NavigationEnd, Event } from '@angular/router';
import { UrlService } from './Services/url.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  previousUrl: string = '';
  currentUrl: string = '';

  constructor(private authService: AuthService,
    private urlService: UrlService,
    private router: Router,
  ) {}

  ngOnInit(): void {

    if (!this.authService.hasVisited()) {
      if (this.authService.isLoggedIn()) {
        this.authService.clearToken();
      }
      this.authService.setVisited();
    }
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.previousUrl = this.currentUrl;
      this.currentUrl = event.url;
      this.urlService.setPreviousUrl(this.previousUrl);
    });
  }
}
