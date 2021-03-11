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
import { TrailEditManagementComponent } from './admin/trail-management/trail-edit-management/trail-edit-management.component';
import { TrailManagementComponent } from './admin/trail-management/trail-management.component';
import { MaintenanceManagementComponent } from './admin/maintenance-management/maintenance-management.component';
import { MaintenanceAddComponent } from './admin/maintenance-management/maintenance-add/maintenance-add.component';
import { AccessibilityManagementComponent } from './admin/accessibility-management/accessibility-management.component';
import { AccessibilityAddComponent } from './admin/accessibility-management/accessibility-add/accessibility-add.component';
import { AdminComponent } from './admin/admin.component';
import { NotFoundComponent } from './not-found/not-found.component';

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
        path: "", component: AdminComponent
      },
      {
        path: "trails", children: [
          {path: "", component: TrailManagementComponent},
          {path: "add", component: TrailAddManagementComponent},
          {path: "edit/:id", component: TrailEditManagementComponent},
        ]
      },
      {
        path: "maintenance", children: [
          {path: "", component: MaintenanceManagementComponent},
          {path: "add", component: MaintenanceAddComponent}
        ]
      },
      {
        path: "accessibility", children: [
          {path: "", component: AccessibilityManagementComponent },
          {path: "add", component: AccessibilityAddComponent}]
      }
    ]
  },
  {path: '404', component: NotFoundComponent},
  {
    path: '**',
    component: NotFoundComponent
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
