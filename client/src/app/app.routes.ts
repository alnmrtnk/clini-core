import type { Routes } from "@angular/router"

export const routes: Routes = [
  {
    path: "",
    redirectTo: "tabs",
    pathMatch: "full",
  },
  {
    path: "tabs",
    loadComponent: () => import("./tabs/tabs.page").then((m) => m.TabsPage),
    children: [
      {
        path: "dashboard",
        loadComponent: () => import("./pages/dashboard/dashboard.page").then((m) => m.DashboardPage),
      },
      {
        path: "appointments",
        loadComponent: () => import("./pages/appointments/appointments.page").then((m) => m.AppointmentsPage),
      },
      {
        path: "patients",
        loadComponent: () => import("./pages/patients/patients.page").then((m) => m.PatientsPage),
      },
      {
        path: "profile",
        loadComponent: () => import("./pages/profile/profile.page").then((m) => m.ProfilePage),
      },
      {
        path: "",
        redirectTo: "/tabs/dashboard",
        pathMatch: "full",
      },
    ],
  },
]