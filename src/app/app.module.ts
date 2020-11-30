import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { MenuSlimComponent } from './menu-slim/menu-slim.component';
import { HomeComponent } from './home/home.component';
import { TrailsComponent } from './trails/trails.component';
import { MapComponent } from './map/map.component';
import { AccessibilityComponent } from './accessibility/accessibility.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { FooterComponent } from './footer/footer.component';
import { TrekkingComponent } from './trekking/trekking.component';
import { SafetyComponent } from './safety/safety.component';
import { TrailDetailPageComponent } from './trail-detail-page/trail-detail-page.component';
import { MapFullComponent } from './map-full/map-full.component';
import { MapTrailListComponent } from './map-trail-list/map-trail-list.component';
import { MapTrailDetailsComponent } from './map-trail-details/map-trail-details.component';
import { HttpClientModule } from '@angular/common/http';
import { LoadingPanelComponent } from './loading-panel/loading-panel.component';
import { MapPreviewComponent } from './map-preview/map-preview.component';
import { MapTrailFullComponent } from './map-trail-full/map-trail-full.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    MenuSlimComponent,
    HomeComponent,
    TrailsComponent,
    MapComponent,
    AccessibilityComponent,
    MaintenanceComponent,
    FooterComponent,
    TrekkingComponent,
    SafetyComponent,
    TrailDetailPageComponent,
    MapFullComponent,
    MapTrailListComponent,
    MapTrailDetailsComponent,
    LoadingPanelComponent,
    MapPreviewComponent,
    MapTrailFullComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }