import {Component, OnInit} from "@angular/core";
import {Subject} from "rxjs";
import {tap, takeUntil} from "rxjs/operators";
import {PoiResponse, PoiService} from "src/app/service/poi-service.service";
import {
    TrailPreview,
    TrailPreviewService,
} from "src/app/service/trail-preview-service.service";
import {components} from "src/binding/Binding";
import {AdminPoiService} from "../../../service/admin-poi-service.service";
import {PoiIconHelper} from "../../../../assets/icons/PoiIconHelper";
import {DateUtils} from "../../../utils/DateUtils";
import {PoiEnums} from "../PoiEnums";

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

    macroMap: Map<string, string> = PoiEnums.macroMap();

    constructor(
        private poiService: PoiService,
        private poiAdminService: AdminPoiService,
        private trailPreviewService: TrailPreviewService
    ) {
    }

    ngOnInit(): void {
        this.getTrailPreviews(0, this.entryPerPage);
    }

    loadPois(page: number): void {
        this.page = page;
        const lowerBound = this.entryPerPage * (page - 1);
        this.getTrailPreviews(lowerBound, this.entryPerPage * page);
    }

    getTrailCode(id: string): string {
        if (this.cachedTrail.length == 0) return "";
        return this.cachedTrail.filter((ct) => ct.id == id)[0].code;
    }

    getTrailPreviews(skip: number, limit: number) {
        this.cachedTrail = [];
        this.isLoading = true;
        this.poiService
            .get(skip, limit)
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
}
