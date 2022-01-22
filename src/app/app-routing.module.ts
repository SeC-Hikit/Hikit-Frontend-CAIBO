import {NgModule} from "@angular/core";
import {HomeComponent} from "./home/home.component";
import {TrailsComponent} from "./trails/trails.component";
import {AccessibilityComponent} from "./accessibility/accessibility.component";
import {MaintenanceComponent} from "./maintenance-view/maintenance.component";
import {RouterModule, Routes} from "@angular/router";
import {SafetyComponent} from "./safety/safety.component";
import {TrekkingComponent} from "./trekking/trekking.component";
import {MapComponent} from "./map-view/map.component";
import {TrailUploadManagementComponent} from "./admin/trail-management/trail-upload-management/trail-upload-management.component";
import {TrailManagementComponent} from "./admin/trail-management/trail-management.component";
import {MaintenanceManagementComponent} from "./admin/maintenance-management/maintenance-management.component";
import {AccessibilityManagementComponent} from "./admin/accessibility-management/accessibility-management.component";
import {AdminComponent} from "./admin/admin.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {AuthGuard} from "./guard/auth.guard";
import {TrailRawManagementComponent} from "./admin/trail-raw-management/trail-raw-management.component";
import {PoiManagementComponent} from "./admin/poi-management/poi-management.component";
import {PoiAddComponent} from "./admin/poi-management/poi-add/poi-add.component";
import {PoiViewTableComponent} from "./admin/poi-management/poi-view-table/poi-view-table.component";
import {AccessibilityAddComponent} from "./admin/accessibility-management/accessibility-add/accessibility-add.component";
import {AccessibilityViewComponent} from "./admin/accessibility-management/accessibility-view/accessibility-view.component";
import {ReportingFormComponent} from "./accessibility/reporting-form/reporting-form.component";
import {CycloComponent} from "./info/cyclo/cyclo.component";
import {CycloManagementComponent} from "./admin/trail-management/cyclo-management/cyclo-management.component";
import {PlaceViewTableComponent} from "./admin/place-management/place-view-table/place-view-table.component";
import {PlaceAddComponent} from "./admin/place-management/place-add/place-add.component";
import {PlaceManagementComponent} from "./admin/place-management/place-management.component";

const routes: Routes = [
    {path: "", redirectTo: "/home", pathMatch: "full"},
    {path: "home", component: HomeComponent},
    {path: "trails", component: TrailsComponent},
    {path: "map", component: MapComponent},
    {path: "map/:id", component: MapComponent},
    {path: "safety", component: SafetyComponent},
    {
        path: "info", children: [
            {
                path: "",
                component: TrekkingComponent
            },
            {
                path: "trekking",
                component: TrekkingComponent
            },
            {
                path: "cyclo",
                component: CycloComponent
            }]
    },

    {path: "trekking", component: TrekkingComponent},
    {
        path: "accessibility",
        children: [
            {
                path: "",
                component: AccessibilityComponent,
            },
            {
                path: "reporting-form",
                component: ReportingFormComponent,
            },
        ],
    },
    {path: "maintenance", component: MaintenanceComponent},

    // ADMIN
    {
        path: "admin",
        canActivate: [AuthGuard],
        children: [
            {
                path: "",
                component: AdminComponent, // TODO: add dashboard
                canActivate: [AuthGuard],
            },
            {
                path: "raw-trail-management",
                component: TrailRawManagementComponent,
            },
            {
                path: "poi-management",
                children: [
                    {path: "view", component: PoiViewTableComponent},
                    {path: "add", component: PoiAddComponent},
                    {path: "modify/:id", component: PoiAddComponent},
                ],
                component: PoiManagementComponent,
            },
            {
                path: "place-management",
                children: [
                    {path: "view", component: PlaceViewTableComponent},
                    {path: "add", component: PlaceAddComponent},
                    {path: "modify/:id", component: PoiAddComponent},
                ],
                component: PlaceManagementComponent,
            },
            {
                path: "trail-management",
                // children : [
                // { path: "modify", component:  },
                component: TrailManagementComponent,
            },
            {
                path: "accessibility-management",
                children: [
                    {path: "", component: AccessibilityViewComponent},
                    {path: "add", component: AccessibilityAddComponent},
                    {path: "modify", component: AccessibilityAddComponent},
                ],
                component: AccessibilityManagementComponent,
            },
            {
                path: "maintenance-management",
                children: [
                    {path: "add", component: AccessibilityAddComponent},
                    {path: "modify/:id", component: AccessibilityAddComponent},
                ],
                component: MaintenanceManagementComponent,
            },
            // Change
            {
                path: "trail",
                children: [
                    {path: "raw/:id", component: TrailUploadManagementComponent},
                    {path: "cyclo/:id", component: CycloManagementComponent},
                ],
            },
        ],
    },
    {path: "404", component: NotFoundComponent},
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
export class AppRoutingModule {
}
