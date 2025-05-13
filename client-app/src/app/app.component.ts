import { Component, HostListener, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ScreenService } from './services/screen.service';
import { AuthService } from './services/auth.service';
import { catchError, of, take } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.scss',
})
export class AppComponent {
  private screenService = inject(ScreenService);
  private authService = inject(AuthService);

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenService.checkScreenSize();
  }

  ngOnInit() {
    this.screenService.checkScreenSize();
    // this.authService
    //   .validate()
    //   .pipe(
    //     take(1),
    //     catchError(() => {
    //       this.authService.logout();
    //       return of(null);
    //     })
    //   )
    //   .subscribe();
  }
}
