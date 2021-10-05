import { BrowserModule } from "@angular/platform-browser";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

import { AppComponent } from "./app.component";
import { MenuComponent } from "./menu/menu.component";
import { MenuSlimComponent } from "./menu/menu-slim/menu-slim.component";
import { HomeComponent } from "./home/home.component";
import { TrailsComponent } from "./trails/trails.component";
import { AccessibilityComponent } from "./accessibility/accessibility.component";
import { MaintenanceComponent } from "./maintenance-view/maintenance.component";
import { FooterComponent } from "./footer/footer.component";
import { TrekkingComponent } from "./trekking/trekking.component";
import { SafetyComponent } from "./safety/safety.component";
import { TrailDetailPageComponent } from "./trail-detail-page/trail-detail-page.component";
import { HttpClientModule } from "@angular/common/http";
import { LoadingPanelComponent } from "./loading-panel/loading-panel.component";
import { MapPreviewComponent } from "./map-preview/map-preview.component";
import { MapComponent } from "./map-view/map.component";
import { MapFullComponent } from "./map-view/map-full/map-full.component";
import { MapTrailDetailsComponent } from "./map-view/map-trail-details/map-trail-details.component";
import { MapTrailListComponent } from "./map-view/map-trail-list/map-trail-list.component";
import { MapTrailFullComponent } from "./map-view/map-trail-full-details/map-trail-full.component";
import { AdminComponent } from "./admin/admin.component";
import { TrailManagementComponent } from "./admin/trail-management/trail-management.component";
import { TrailUploadManagementComponent } from "./admin/trail-management/trail-upload-management/trail-upload-management.component";
import { MaintenanceManagementComponent } from "./admin/maintenance-management/maintenance-management.component";
import { MaintenanceAddComponent } from "./admin/maintenance-management/maintenance-add/maintenance-add.component";
import { AccessibilityManagementComponent } from "./admin/accessibility-management/accessibility-management.component";
import { AccessibilityAddComponent } from "./admin/accessibility-management/accessibility-add/accessibility-add.component";
import { MenuManagementComponent } from "./admin/menu-management/menu-management.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { QuillModule } from "ngx-quill";
import { ReactiveFormsModule } from "@angular/forms";
import { LocationEntryComponent } from "./admin/trail-management/trail-upload-management/location-entry/location-entry.component";
import { IncreasedIndexPipe } from "./IncreasedIndexPipe";
import { EtaPipe } from "./EtaPipe";
import { UploadButtonManagementComponent } from "./admin/upload-button-management/upload-button-management.component";
import { TrailRawManagementComponent } from './admin/trail-raw-management/trail-raw-management.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { initializeKeycloak } from "src/init/keycloak-init.factory";
import { MenuAdminComponent } from "./menu/menu-admin/menu-admin.component";
import { PoiManagementComponent } from "./admin/poi-management/poi-management.component";
import { TrailIntersectionEntryComponent } from './admin/trail-management/trail-intersection-entry/trail-intersection-entry.component';
import { PoiAddComponent } from './admin/poi-management/poi-add/poi-add.component';
import { PoiViewTableComponent } from './admin/poi-management/poi-view-table/poi-view-table.component';
import { TrailFloatingPreviewComponent } from './shared/trail-floating-preview/trail-floating-preview.component';
import { AccessibilityReportViewComponent } from './admin/accessibility-management/accessibility-report-view/accessibility-report-view.component';
import { AccessibilityNotificationViewComponent } from './admin/accessibility-management/accessibility-notification-view/accessibility-notification-view.component';
import { ItemsNotFoundComponent } from './shared/items-not-found/items-not-found.component';
import { AccessibilityViewComponent } from './admin/accessibility-management/accessibility-view/accessibility-view.component';
import { ReportingFormComponent } from './accessibility/reporting-form/reporting-form.component';
import { LocationEntryReportComponent } from "./accessibility/reporting-form/location-report-entry/location-entry.component";

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    MenuAdminComponent,
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
    MapTrailFullComponent,
    AdminComponent,
    TrailManagementComponent,
    TrailUploadManagementComponent,
    MaintenanceManagementComponent,
    MaintenanceAddComponent,
    AccessibilityManagementComponent,
    AccessibilityAddComponent,
    MenuManagementComponent,
    NotFoundComponent,
    LocationEntryComponent,
    IncreasedIndexPipe,
    PoiManagementComponent,
    EtaPipe,
    UploadButtonManagementComponent,
    TrailRawManagementComponent,
    LoadingSpinnerComponent,
    TrailIntersectionEntryComponent,
    PoiAddComponent,
    PoiViewTableComponent,
    TrailFloatingPreviewComponent,
    AccessibilityReportViewComponent,
    AccessibilityNotificationViewComponent,
    ItemsNotFoundComponent,
    AccessibilityViewComponent,
    ReportingFormComponent,
    LocationEntryReportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    KeycloakAngularModule,
    QuillModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    }
  ],
  bootstrap: [AppComponent],
  exports: [TrailIntersectionEntryComponent],
})
export class AppModule {}
