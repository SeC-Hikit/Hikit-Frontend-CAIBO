import { Component, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { tap, takeUntil } from "rxjs/operators";
import { PoiResponse, PoiService } from "src/app/service/poi-service.service";
import {
  TrailPreview,
  TrailPreviewService,
} from "src/app/service/trail-preview-service.service";
import { TrailService } from "src/app/service/trail-service.service";
import { components } from "src/binding/Binding";

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

  constructor(
    private poiService: PoiService,
    private trailPreviewService: TrailPreviewService
  ) {}

  ngOnInit(): void {
    this.getTrailPreviews(0, this.entryPerPage);
  }

  loadPois(page: number): void {
    this.page = page;
    const lowerBound = this.entryPerPage * (page - 1);
    this.getTrailPreviews(lowerBound, this.entryPerPage * page);
  }

  getTrailCode(id: string): string {
    console.log(this.cachedTrail.filter((ct) => ct.id == id));
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
            this.trailPreviewService.getPreview(trailId).subscribe((resp) => {
              resp.content.forEach((it) => this.cachedTrail.push(it));
            })
          )
        );
        this.poiResponse = preview;
        this.totalPoi = preview.totalCount;
        this.isLoading = false;
      });
  }
}
