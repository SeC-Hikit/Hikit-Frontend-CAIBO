import {NgModule} from "@angular/core";
import {HomeComponent} from "./home/home.component";
import {TrailsComponent} from "./trails/trails.component";
import {AccessibilityComponent} from "./accessibility/accessibility.component";
import {MaintenanceComponent} from "./maintenance-view/maintenance.component";
import {RouterModule, Routes} from "@angular/router";
import {SafetyComponent} from "./safety/safety.component";
import {TrekkingComponent} from "./trekking/trekking.component";
import {MapComponent} from "./map-view/map.component";
import {
    TrailUploadManagementComponent
} from "./admin/trail-management/trail-upload-management/trail-upload-management.component";
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
import {
    AccessibilityAddComponent
} from "./admin/accessibility-management/accessibility-add/accessibility-add.component";
import {
    AccessibilityViewComponent
} from "./admin/accessibility-management/accessibility-view/accessibility-view.component";
import {ReportingFormComponent} from "./accessibility/reporting-form/reporting-form.component";
import {CycloComponent} from "./info/cyclo/cyclo.component";
import {CycloManagementComponent} from "./admin/trail-management/cyclo-management/cyclo-management.component";
import {PlaceViewTableComponent} from "./admin/place-management/place-view-table/place-view-table.component";
import {PlaceAddComponent} from "./admin/place-management/place-add/place-add.component";
import {PlaceManagementComponent} from "./admin/place-management/place-management.component";
import {
    TrailModifyManagementComponent
} from "./admin/trail-management/trail-modify-management/trail-modify-management.component";
import {TrailViewTableComponent} from "./admin/trail-management/trail-view-table/trail-view-table.component";
import {
    TrailRawViewTableComponent
} from "./admin/trail-raw-management/trail-raw-view-table/trail-raw-view-table.component";
import {PlaceEditComponent} from "./admin/place-management/place-edit/place-edit.component";
import {
    LandingPageSuccessComponent
} from "./accessibility/reporting-form/landing-page-success/landing-page-success.component";
import {MaintenanceAddComponent} from "./admin/maintenance-management/maintenance-add/maintenance-add.component";
import {MaintenanceViewComponent} from "./admin/maintenance-management/maintenance-view/maintenance-view.component";
import {PlaceGeneralViewComponent} from "./admin/place-management/place-general-view/place-general-view.component";
import {AnnouncementEditComponent} from "./admin/announcement-management/announcement-edit/announcement-edit.component";
import {AnnouncementManagementComponent} from "./admin/announcement-management/announcement-management.component";
import {AdminAnnouncementViewComponent} from "./admin/announcement-management/announcement-view/admin-announcement-view.component";
import {AnnouncementViewComponent} from "./announcement-view/announcement-view.component";
import {AnnouncementSingleViewComponent} from "./announcement-single-view/announcement-single-view.component";
import {CreditsComponent} from "./credits/credits.component";
import {DevelopmentComponent} from "./development/development.component";
import {BugReportingComponent} from "./bug-reporting/bug-reporting.component";

const routes: Routes = [
    {path: "", redirectTo: "/home", pathMatch: "full"},
    {path: "home", component: HomeComponent},
    {path: "trails", component: TrailsComponent},
    {path: "map", children: [
            {
                path: "",
                component: MapComponent
            },
            {
                path: "trail/:id",
                component: MapComponent
            },
            {
                path: "place/:id",
                component: MapComponent
            },
            {
                path: "accessibility/:id",
                component: MapComponent
            },
            {
                path: "poi/:id",
                component: MapComponent
            }
        ], },
    {path: "credits", component: CreditsComponent},
    {path: "development", children: [
            {
                path: "",
                component: DevelopmentComponent
            },
            {
                path: "bug-reporting",
                component: BugReportingComponent
            }
    ]},
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
                path: "success",
                component: LandingPageSuccessComponent,
            },
            {
                path: "reporting-form",
                component: ReportingFormComponent,
            },
            {
                path: "reporting-form/:id",
                component: ReportingFormComponent,
            }
        ],
    },
    {path: "announcements", component: AnnouncementViewComponent},
    {path: "announcements/:id", component: AnnouncementSingleViewComponent},
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
                children: [
                    {path: "", component: TrailRawViewTableComponent},
                    {path: "view", component: TrailRawViewTableComponent},
                    {path: "init/:id", component: TrailUploadManagementComponent},
                    {path: "init/:id/:quick", component: TrailUploadManagementComponent}
                ],
                component: TrailRawManagementComponent,
            },
            {
                path: "poi-management",
                children: [
                    {path: "", component: PoiViewTableComponent},
                    {path: "view", component: PoiViewTableComponent},
                    {path: "add", component: PoiAddComponent},
                    {path: "edit/:id", component: PoiAddComponent},
                ],
                component: PoiManagementComponent,
            },
            {
                path: "place-management",
                children: [
                    {path: "", component: PlaceGeneralViewComponent},
                    {path: "view", component: PlaceViewTableComponent},
                    {path: "add", component: PlaceAddComponent},
                    {path: "edit/:id", component: PlaceEditComponent},
                ],
                component: PlaceManagementComponent,
            },
            {
                path: "trail-management",
                children: [
                    {path: "", component: TrailViewTableComponent},
                    {path: "view", component: TrailViewTableComponent},
                    {path: "cyclo/:id", component: CycloManagementComponent},
                    {path: "edit/:id", component: TrailModifyManagementComponent}
                ],
                component: TrailManagementComponent,
            },
            {
                path: "accessibility-management",
                children: [
                    {path: "", component: AccessibilityViewComponent},
                    {path: "add", component: AccessibilityAddComponent},
                    {path: "edit/:id", component: AccessibilityAddComponent},
                ],
                component: AccessibilityManagementComponent,
            },
            {
                path: "maintenance-management",
                children: [
                    {path: "", component: MaintenanceViewComponent},
                    {path: "add", component: MaintenanceAddComponent},
                    {path: "edit/:id", component: MaintenanceAddComponent},
                ],
                component: MaintenanceManagementComponent,
            },
            {
                path: "announcement-management",
                children: [
                    {path: "", component: AdminAnnouncementViewComponent},
                    {path: "add", component: AnnouncementEditComponent},
                    {path: "add/:id", component: AnnouncementEditComponent},
                    {path: "edit/:id", component: AnnouncementEditComponent},
                    {path: "add/topic/:relatedTopic/id/:relatedTopicId", component: AnnouncementEditComponent},
                ],
                component: AnnouncementManagementComponent,
            },
        ]
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
