import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { TrailsComponent } from './trails/trails.component';
import { MapComponent } from './map/map.component';
import { AccessibilityComponent } from './accessibility/accessibility.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { RouterModule, Routes } from '@angular/router';
import { SafetyComponent } from './safety/safety.component';
import { TrekkingComponent } from './trekking/trekking.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: "home", component: HomeComponent },
  { path: "trails", component: TrailsComponent },
  { path: "map", component: MapComponent },
  { path: "map/:id?", component: MapComponent },
  { path: "safety", component: SafetyComponent },
  { path: "trekking", component: TrekkingComponent },
  { path: "accessibility", component: AccessibilityComponent },
  { path: "maintenance", component: MaintenanceComponent },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
