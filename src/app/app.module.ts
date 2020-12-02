import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { MenuSlimComponent } from './menu-slim/menu-slim.component';
import { HomeComponent } from './home/home.component';
import { TrailsComponent } from './trails/trails.component';
import { AccessibilityComponent } from './accessibility/accessibility.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { FooterComponent } from './footer/footer.component';
import { TrekkingComponent } from './trekking/trekking.component';
import { SafetyComponent } from './safety/safety.component';
import { TrailDetailPageComponent } from './trail-detail-page/trail-detail-page.component';
import { HttpClientModule } from '@angular/common/http';
import { LoadingPanelComponent } from './loading-panel/loading-panel.component';
import { MapPreviewComponent } from './map-preview/map-preview.component';
import { MapComponent } from './map-view/map.component';
import { MapFullComponent } from './map-view/map-full/map-full.component';
import { MapTrailDetailsComponent } from './map-view/map-trail-details/map-trail-details.component';
import { MapTrailListComponent } from './map-view/map-trail-list/map-trail-list.component';
import { MapTrailFullComponent } from './map-view/map-trail-full-details/map-trail-full.component';

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
