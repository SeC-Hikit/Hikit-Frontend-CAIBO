import { Component, OnInit } from '@angular/core';
import { PoiResponse, PoiService } from 'src/app/service/poi-service.service';
import { components } from 'src/binding/Binding';

export type PoiDto = components["schemas"]["PoiDto"];

@Component({
  selector: 'app-poi-view-table',
  templateUrl: './poi-view-table.component.html',
  styleUrls: ['./poi-view-table.component.scss']
})
export class PoiViewTableComponent implements OnInit {

  entryPerPage = 10;
  page = 1;
  isLoading = false;

  poiResponse: PoiResponse;
  poiPreviewList: PoiDto[] = [];

  savedTrailCode: string;

  constructor(private poiService: PoiService) { }

  ngOnInit(): void {
    this.getAllPreviews();
  }

  getAllPreviews() {
    this.isLoading = true;
    this.poiService.get(0, this.entryPerPage).subscribe((poiResponse) => {
      this.poiResponse = poiResponse;
      this.poiPreviewList = poiResponse.content;
      this.isLoading = false;
    });
  }
}
