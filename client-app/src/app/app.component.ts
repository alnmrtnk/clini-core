import { Component, HostListener, inject } from "@angular/core"
import { IonicModule } from "@ionic/angular"
import { CommonModule } from "@angular/common"
import { RouterOutlet } from "@angular/router"
import { ScreenService } from "./services/screen.service"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `,
  styles: [
    `
    ion-app {
      background: radial-gradient(circle, var(--ion-color-primary-tint) 0%, white 100%);
    }
  `,
  ],
})
export class AppComponent {
  private screenService = inject(ScreenService)

  @HostListener("window:resize", ["$event"])
  onResize() {
    this.screenService.checkScreenSize()
  }

  ngOnInit() {
    this.screenService.checkScreenSize()
  }
}

