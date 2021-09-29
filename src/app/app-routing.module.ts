import { NgModule } from "@angular/core";
import { HomeComponent } from "./home/home.component";
import { TrailsComponent } from "./trails/trails.component";
import { AccessibilityComponent } from "./accessibility/accessibility.component";
import { MaintenanceComponent } from "./maintenance-view/maintenance.component";
import { RouterModule, Routes } from "@angular/router";
import { SafetyComponent } from "./safety/safety.component";
import { TrekkingComponent } from "./trekking/trekking.component";
import { MapComponent } from "./map-view/map.component";
import { TrailUploadManagementComponent } from "./admin/trail-management/trail-upload-management/trail-upload-management.component";
import { TrailManagementComponent } from "./admin/trail-management/trail-management.component";
import { MaintenanceManagementComponent } from "./admin/maintenance-management/maintenance-management.component";
import { AccessibilityManagementComponent } from "./admin/accessibility-management/accessibility-management.component";
import { AdminComponent } from "./admin/admin.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { AuthGuard } from "./guard/auth.guard";
import { TrailRawManagementComponent } from "./admin/trail-raw-management/trail-raw-management.component";
import { PoiManagementComponent } from "./admin/poi-management/poi-management.component";
import { PoiAddComponent } from "./admin/poi-management/poi-add/poi-add.component";
import { PoiViewTableComponent } from "./admin/poi-management/poi-view-table/poi-view-table.component";

const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "trails", component: TrailsComponent },
  { path: "map", component: MapComponent },
  { path: "map/:id", component: MapComponent },
  { path: "safety", component: SafetyComponent },
  { path: "trekking", component: TrekkingComponent },
  { path: "accessibility", component: AccessibilityComponent },
  { path: "maintenance", component: MaintenanceComponent },
  {
    path: "admin", canActivate: [AuthGuard], children: [
      {
        path: "dashboard",
        component: AdminComponent, // TODO: add dashboard
        canActivate: [AuthGuard]
      },
      {
        path: "raw-trail-management",
        component: TrailRawManagementComponent
      },
      {
        path: "poi-management",
        children : [
          { path: "view", component: PoiViewTableComponent },
          { path: "entry", component: PoiAddComponent },
          { path: "entry/:id", component: PoiAddComponent }
        ],
        component: PoiManagementComponent
      },
      {
        path: "trail-management",
        component: TrailManagementComponent
      },
      {
        path: "accessibility-management",
        component: AccessibilityManagementComponent
      },
      {
        path: "maintenance-management",
        component: MaintenanceManagementComponent
      },
      // Change
      {
        path: "trail",
        children: [
          { path: "raw/:id", component: TrailUploadManagementComponent },
        ]
      }
    ]
  },
  { path: "404", component: NotFoundComponent },
  {
    path: "**",
    component: NotFoundComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
