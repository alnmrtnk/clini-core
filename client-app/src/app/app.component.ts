import { Component, HostListener, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ScreenService } from './services/screen.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.scss',
})
export class AppComponent {
  private screenService = inject(ScreenService);

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenService.checkScreenSize();
  }

  ngOnInit() {
    this.screenService.checkScreenSize();
  }
}
