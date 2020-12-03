import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { TrailsComponent } from './trails/trails.component';
import { AccessibilityComponent } from './accessibility/accessibility.component';
import { MaintenanceComponent } from './maintenance-view/maintenance.component';
import { RouterModule, Routes } from '@angular/router';
import { SafetyComponent } from './safety/safety.component';
import { TrekkingComponent } from './trekking/trekking.component';
import { MapComponent } from './map-view/map.component';
import { TrailAddManagementComponent } from './admin/trail-management/trail-add-management/trail-add-management.component';
import { TrailManagementComponent } from './admin/trail-management/trail-management.component';
import { MaintenanceManagementComponent } from './admin/maintenance-management/maintenance-management.component';
import { MaintenanceAddComponent } from './admin/maintenance-add/maintenance-add.component';
import { AccessibilityManagementComponent } from './admin/accessibility-management/accessibility-management.component';
import { AccessibilityAddComponent } from './admin/accessibility-add/accessibility-add.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: "home", component: HomeComponent },
  { path: "trails", component: TrailsComponent },
  { path: "map", component: MapComponent },
  { path: "map/:id", component: MapComponent },
  { path: "safety", component: SafetyComponent },
  { path: "trekking", component: TrekkingComponent },
  { path: "accessibility", component: AccessibilityComponent },
  { path: "maintenance", component: MaintenanceComponent },
  {
    path: "admin", children: [
      {
        path: "trail", component: TrailManagementComponent, children: [{
          path: "add", component: TrailAddManagementComponent
        }]
      },
      {
        path: "maintenance", component: MaintenanceManagementComponent, children: [{
          path: "add", component: MaintenanceAddComponent
        }]
      },
      {
        path: "accessibility", component: AccessibilityManagementComponent, children: [{
          path: "add", component: AccessibilityAddComponent
        }]
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
