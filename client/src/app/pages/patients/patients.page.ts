import { Component } from "@angular/core"
import { IonicModule } from "@ionic/angular"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-patients",
  templateUrl: "patients.page.html",
  styleUrls: ["patients.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class PatientsPage {
  constructor() {}
}

