import { Component, Input, OnInit } from '@angular/core';
import { Trail } from '../Trail';
import { TrailPreviewService } from '../trail-preview-service.service';
import { TrailService } from '../trail-service.service';
import { TrailPreview } from '../TrailPreview';
import { TrailPreviewResponse } from '../TrailPreviewResponse';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  // Bound elements
  trailPreviewList: TrailPreview[];
  selectedTrail: Trail
  trailList: Trail[]
  selectedTileLayer: string;

  isTrailSelectedVisible: boolean
  isTrailListVisible: boolean
  isAllTrailVisible: boolean

  constructor(
    private trailService: TrailService,
    private trailPreviewService: TrailPreviewService) { }

  ngOnInit(): void {
    this.isTrailSelectedVisible = false;
    this.isTrailListVisible = false;
    this.isAllTrailVisible = false;
    this.changeTileLayer("topo");
    this.trailPreviewList = [];
    this.trailList = [];
  }
  
  loadPreviews(): void {
    this.trailPreviewService.getPreviews().subscribe(previewResponse => { this.trailPreviewList = previewResponse.trailPreviews; console.log(this.trailPreviewList) });
  }

  loadTrail(code: string): void {
    this.trailService.getTrailByCode(code).subscribe(trailResponse => { this.selectedTrail = trailResponse.trails[0] });
  }

  loadAllTrails(): void {
    this.trailService.getTrailsLow().subscribe(trailResponse => { this.trailList = trailResponse.trails });
  }

  changeTileLayer(type: string): void {
    this.selectedTileLayer = type;
  }

  toggleList(): void {
    this.isTrailListVisible = this.isTrailListVisible ? false : true;
    if (this.trailPreviewList.length == 0 && this.isTrailListVisible) {
      this.loadPreviews();
    }
  }

  toggleAllTrails(): void {
    this.isAllTrailVisible = this.isAllTrailVisible ? false : true;
    if (this.trailList.length == 0 && this.isAllTrailVisible) {
      this.loadAllTrails();
    }
  }

}
