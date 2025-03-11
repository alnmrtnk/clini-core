import type { Routes } from "@angular/router"

export const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
  {
    path: "dashboard",
    loadComponent: () => import("./dashboard/dashboard.page").then((m) => m.DashboardPage),
  },
  {
    path: "vaccinations",
    loadComponent: () => import("./vaccinations/vaccinations.page").then((m) => m.VaccinationsPage),
  },
  {
    path: "test-results",
    loadComponent: () => import("./test-results/test-results.page").then((m) => m.TestResultsPage),
  },
  {
    path: "prescriptions",
    loadComponent: () => import("./prescriptions/prescriptions.page").then((m) => m.PrescriptionsPage),
  },
  {
    path: "appointments",
    loadComponent: () => import("./appointments/appointments.page").then((m) => m.AppointmentsPage),
  },
  {
    path: "documents",
    loadComponent: () => import("./documents/documents.page").then((m) => m.DocumentsPage),
  },
  {
    path: "profile",
    loadComponent: () => import("./profile/profile.page").then((m) => m.ProfilePage),
  },
]

