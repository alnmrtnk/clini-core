import { Component, HostListener, inject, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { ScreenService } from './services/screen.service';
import { AuthService } from './services/auth.service';
import { catchError, filter, of, take } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.scss',
})
export class AppComponent implements OnInit {
  private screenService = inject(ScreenService);
  private authService = inject(AuthService);
  private router = inject(Router);

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenService.checkScreenSize();
  }

  ngOnInit() {
    this.screenService.checkScreenSize();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const url = (event as NavigationEnd).urlAfterRedirects;
        if (!url.startsWith('/medical-records')) {
          this.validate();
        } else {
          this.authService.logout(false);
        }
      });
  }

  private validate() {
    this.authService
      .validate()
      .pipe(
        take(1),
        catchError(() => {
          this.authService.logout();

          return of(null);
        })
      )
      .subscribe();
  }
}
