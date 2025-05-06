import { Routes } from "@angular/router"
import { AuthGuard } from "./guards/auth.guard"

export const routes: Routes = [
  {
    path: "",
    redirectTo: "tabs",
    pathMatch: "full",
  },
  {
    path: "tabs",
    canActivate: [AuthGuard],
    loadChildren: () => import("./tabs/tabs.routes").then((m) => m.routes),
  },
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.routes").then((m) => m.routes),
  },
  {
    path: "**",
    redirectTo: "tabs",
  },
]

