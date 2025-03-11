import { Component } from "@angular/core"
import { RouterLink, RouterOutlet } from "@angular/router"
import { Platform } from "@ionic/angular/standalone"
import { SplashScreen } from "@capacitor/splash-screen"
import { StatusBar } from "@capacitor/status-bar"
import {
  IonApp,
  IonSplitPane,
  IonMenu,
  IonContent,
  IonList,
  IonListHeader,
  IonNote,
  IonMenuToggle,
  IonItem,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonButton,
  IonFooter,
  IonToolbar,
} from "@ionic/angular/standalone"
import { NgFor, NgClass } from "@angular/common"
import { addIcons } from "ionicons"
import {
  home,
  fitness,
  clipboard,
  medkit,
  calendar,
  document,
  person,
  menuOutline,
  chevronForward,
  chevronBack,
} from "ionicons/icons"

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
  standalone: true,
  imports: [
    RouterLink,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonListHeader,
    IonNote,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonButton,
    NgFor,
    NgClass,
  ],
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

  menuExpanded = false

  constructor(private platform: Platform) {
    this.initializeApp()
    addIcons({
      home,
      fitness,
      clipboard,
      medkit,
      calendar,
      document,
      person,
      menuOutline,
      chevronForward,
      chevronBack,
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is("capacitor")) {
        StatusBar.setBackgroundColor({ color: "#4A90E2" })
        SplashScreen.hide()
      }
    })
  }

  isMobile(): boolean {
    return window.innerWidth < 768
  }

  toggleMenu() {
    this.menuExpanded = !this.menuExpanded
  }
}

