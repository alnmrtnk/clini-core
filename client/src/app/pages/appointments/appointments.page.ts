import { Component } from "@angular/core"
import { IonicModule } from "@ionic/angular"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-appointments",
  templateUrl: "appointments.page.html",
  styleUrls: ["appointments.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class AppointmentsPage {
  constructor() {}
}

