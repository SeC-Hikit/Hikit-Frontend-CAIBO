import {Component, OnInit} from "@angular/core";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {PoiResponse, PoiService} from "src/app/service/poi-service.service";
import {TrailPreview, TrailPreviewService,} from "src/app/service/trail-preview-service.service";
import {components} from "src/binding/Binding";
import {AdminPoiService} from "../../../service/admin-poi-service.service";
import {PoiIconHelper} from "../../../../assets/icons/PoiIconHelper";
import {DateUtils} from "../../../utils/DateUtils";
import {PoiEnums} from "../PoiEnums";
import {TrailDto, TrailService} from "../../../service/trail-service.service";
import {Marker} from "../../../map-preview/map-preview.component";
import {MapPinIconType} from "../../../../assets/icons/MapPinIconType";
import {Coordinates2D} from "../../../service/geo-trail-service";
import {AuthService} from "../../../service/auth.service";
import {PaginationUtils} from "../../../utils/PaginationUtils";
import {InfoModalComponent} from "../../../modal/info-modal/info-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AnnouncementTopic} from "../../../service/announcement.service";

export type PoiDto = components["schemas"]["PoiDto"];

@Component({
    selector: "app-poi-view-table",
    templateUrl: "./poi-view-table.component.html",
    styleUrls: ["./poi-view-table.component.scss"],
})
export class PoiViewTableComponent implements OnInit {
    entryPerPage = 10;
    page = 1;
    isLoading = true;
    totalPoi = 0;

    private destroy$ = new Subject();

    poiResponse: PoiResponse;
    cachedTrail: TrailPreview[] = [];

    savedTrailCode: string;
    selected: PoiDto;

    selectedTrail: TrailDto;
    marker: Marker;

    macroMap: Map<string, string> = PoiEnums.macroMap();

    isPreviewVisible: boolean = false;
    private realm: string = "";

    constructor(
        public authService: AuthService,
        private poiService: PoiService,
        private poiAdminService: AdminPoiService,
        private trailPreviewService: TrailPreviewService,
        private trailService: TrailService,
        private modalService: NgbModal
    ) {
    }

    ngOnInit(): void {
        this.realm = this.authService.getInstanceRealm();
        this.getTrailPreviews(0, this.entryPerPage);
    }

    loadPois(page: number): void {
        this.page = page;
        const lowerBound = this.entryPerPage * (page - 1);
        this.getTrailPreviews(lowerBound, this.entryPerPage * page);
    }

    getTrailCode(id: string): string {
        if (!id) return "";
        if (this.cachedTrail.length == 0) return "";
        return this.cachedTrail.filter((ct) => ct.id == id)[0].code;
    }

    getTrailPreviews(skip: number, limit: number) {
        this.cachedTrail = [];
        this.isLoading = true;
        this.poiService
            .get(skip, limit, this.realm)
            .pipe(takeUntil(this.destroy$))
            .subscribe((preview: PoiResponse) => {
                preview.content.forEach((poi) =>
                    poi.trailIds.forEach((trailId) =>
                        this.trailPreviewService.getPreview(trailId)
                            .subscribe((resp) => {
                                resp.content.forEach((it) =>
                                    this.cachedTrail.push(it));
                            })
                    )
                );
                this.poiResponse = preview;
                this.totalPoi = preview.totalCount;
                this.isLoading = false;
            });
    }

    onDelete(id: string) {
        this.poiAdminService.delete(id).toPromise()
            .then((_) => {
                this.loadPois(this.page);
            });
    }

    formatStringDateToDashes(uploadedOn: string) {
        return DateUtils.formatDateToDay(uploadedOn);
    }

    getPoiIcon(poi: PoiDto) {
        return PoiIconHelper.get(poi);
    }

    showPreview(coords: Coordinates2D, trailId: string) {
        this.trailService.getTrailById(trailId).subscribe(
            trailResp => {
                this.marker = {color: "#1D9566", icon: MapPinIconType.PIN, coords: coords};
                this.selectedTrail = trailResp.content[0];
                this.togglePreview();
            }
        );
    }

    togglePreview() {
        this.isPreviewVisible = !this.isPreviewVisible;
    }

    copyId(id: string) {
        PaginationUtils.copyToClipboard(id).then(() => {
            const modal = this.modalService.open(InfoModalComponent);
            modal.componentInstance.title = "ID '" + id + "', copiato";
            if(this.authService.isRealmMatch()) {
                modal.componentInstance.body = PaginationUtils.getOptionsText(id,
                    AnnouncementTopic.POI)
            }
        })
    }
}
