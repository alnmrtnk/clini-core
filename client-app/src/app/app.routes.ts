import { Routes } from "@angular/router"

export const routes: Routes = [
  {
    path: "",
    redirectTo: "tabs",
    pathMatch: "full",
  },
  {
    path: "tabs",
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

