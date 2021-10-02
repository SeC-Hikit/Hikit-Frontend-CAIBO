import { Component, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { tap, takeUntil } from "rxjs/operators";
import { PoiResponse, PoiService } from "src/app/service/poi-service.service";
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
  isLoading = false;
  totalPoi = 0;

  private destroy$ = new Subject();

  poiResponse: PoiResponse;

  savedTrailCode: string;

  constructor(private poiService: PoiService) {}

  ngOnInit(): void {
    this.getTrailPreviews(0, this.entryPerPage);
  }

  loadPois(page: number): void {
    this.page = page;
    const lowerBound = this.entryPerPage * (page - 1);
    this.getTrailPreviews(lowerBound, this.entryPerPage);
  }

  getTrailPreviews(skip: number, limit: number) {
    this.isLoading = true;
    this.poiService
      .get(skip, limit)
      .pipe(
        takeUntil(this.destroy$),
        tap((_) => (this.isLoading = false))
      )
      .subscribe((preview: PoiResponse) => {
        this.poiResponse = preview;
        this.totalPoi = preview.totalCount;
      });
  }
}
