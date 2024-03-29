import {Component, OnInit} from "@angular/core";
import {Status} from "src/app/Status";
import {TrailPreview, TrailPreviewResponse, TrailPreviewService,} from "src/app/service/trail-preview-service.service";
import {takeUntil, tap} from "rxjs/operators";
import {TrailDto, TrailService} from "src/app/service/trail-service.service";
import {Subject} from "rxjs";
import {AdminTrailService} from "../../service/admin-trail.service";
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {Profile, ProfileChecker} from "../ProfileChecker";

@Component({
    selector: "app-trail-management",
    templateUrl: "./trail-management.component.html",
    styleUrls: ["./trail-management.component.scss"],
})
export class TrailManagementComponent implements OnInit {
    entryPerPage = 10;
    page = 1;
    isLoading = false;

    isAllowed: boolean = false;

    private destroy$ = new Subject();

    selectedTrail: TrailDto;
    isPreviewVisible: boolean = false;
    trailPreviewList: TrailPreview[];

    savedTrailCode: string;
    totalTrail: number;
    realm: string = "";

    constructor(
        private trailPreviewService: TrailPreviewService,
        private trailService: TrailService,
        private adminTrailService: AdminTrailService,
        private authService: AuthService,
        private routerService: Router
    ) {
    }

    async ngOnInit() {
        this.realm = this.authService.getInstanceRealm();
        this.getAllPreviews();

        let allowedProfiles: Profile[] = [Profile.admin, Profile.maintainer];
        this.isAllowed = await ProfileChecker.checkProfile(this.authService, allowedProfiles);
        console.log(this.isAllowed);
        if (this.isAllowed == false) {
               this.routerService.navigate(['/admin']);
        }
    }

    getAllPreviews() {
        this.isLoading = true;
        this.getTrailPreviews(0, this.entryPerPage, this.realm);
    }

    onFileSave(codeTrailSaved: string) {
        this.savedTrailCode = codeTrailSaved;
    }

    onPreview(selectedTrailPreview: TrailPreview) {
        this.trailService
            .getTrailById(selectedTrailPreview.id)
            .subscribe((trail) => {
                this.selectedTrail = trail.content[0];
                this.isPreviewVisible = true;
            });
    }

    onDelete(e: Event, selectedTrailPreview: TrailPreview) {
        e.stopPropagation();
        let isUserCancelling = confirm(
            "Sei sicuro di voler cancellare il sentiero '" +
            selectedTrailPreview.code +
            "'?"
        );
        if (isUserCancelling) {
            this.adminTrailService
                .deleteById(selectedTrailPreview.id)
                .subscribe((r) => {
                    if (r.status == Status.OK) {
                        this.onDeleteSuccess(selectedTrailPreview);
                    }
                });
        }
    }

    loadTrails(page: number): void {
        this.page = page;
        const lowerBound = this.entryPerPage * (page - 1);
        this.getTrailPreviews(lowerBound, this.entryPerPage * page, this.realm);
    }

    getTrailPreviews(skip: number, limit: number, realm: string) {
        this.isLoading = true;
        this.trailPreviewService.getPreviews(skip, limit, realm)
            .pipe(
                takeUntil(this.destroy$),
                tap(_ => this.isLoading = false)
            )
            .subscribe((preview: TrailPreviewResponse) => {
                this.totalTrail = preview.totalCount;
                this.trailPreviewList = preview.content;
            });
    }

    togglePreview() {
        this.isPreviewVisible = !this.isPreviewVisible;
    }

    onDeleteSuccess(selectedTrailPreview: TrailPreview) {
        let i = this.trailPreviewList.indexOf(selectedTrailPreview);
        this.trailPreviewList.splice(i, 1);
    }

    getLocationsFromPreview(trailPreview: TrailPreview): string {
        if (trailPreview.locations == null) return "";
        return trailPreview.locations.map(t => t.name).join("-");
    }

    onSearch($event: string) {

    }
}
