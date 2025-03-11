import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  public appPages = [
    { title: "Dashboard", url: "/dashboard", icon: "home" },
    { title: "Vaccinations", url: "/vaccinations", icon: "fitness" },
    { title: "Test Results", url: "/test-results", icon: "clipboard" },
    { title: "Prescriptions", url: "/prescriptions", icon: "medkit" },
    { title: "Appointments", url: "/appointments", icon: "calendar" },
    { title: "Documents", url: "/documents", icon: "document" },
    { title: "Profile", url: "/profile", icon: "person" },
  ]

  constructor(private platform: Platform) {
    this.initializeApp()
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is("capacitor")) {
        StatusBar.setBackgroundColor({ color: "#4A90E2" })
        SplashScreen.hide()
      }
    })
  }
}
