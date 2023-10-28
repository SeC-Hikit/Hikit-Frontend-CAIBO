import { Component, OnInit } from '@angular/core';
import {PlaceDto, PlaceService} from "../../../service/place.service";
import {TrailDto, TrailService} from "../../../service/trail-service.service";
import {Marker} from "../../../map-preview/map-preview.component";
import {AuthService} from "../../../service/auth.service";
import {AdminPlaceService} from "../../../service/admin-place.service";
import {TrailPreviewService} from "../../../service/trail-preview-service.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DateUtils} from "../../../utils/DateUtils";
import {MapPinIconType} from "../../../../assets/icons/MapPinIconType";
import {InfoModalComponent} from "../../../modal/info-modal/info-modal.component";
import {PaginationUtils} from "../../../utils/PaginationUtils";

@Component({
  selector: 'app-auto-crossway-view',
  templateUrl: './auto-crossway-view.component.html',
  styleUrls: ['./auto-crossway-view.component.scss']
})
export class AutoCrosswayViewComponent implements OnInit {

  placeList: PlaceDto[] = [];
  placePreview: PlaceDto;
  trailsPreview: TrailDto[] = [];
  markersPreview: Marker[] = [];

  trailMap: Map<String, String> = new Map();

  isPlacePreviewVisible = false;

  realm = "";
  entryPerPage = 10;
  totalPlaces = 0;
  selectedPage: number = 0;

  constructor(public authService: AuthService,
              private placeService: PlaceService,
              private adminPlaceService: AdminPlaceService,
              private trailService: TrailService,
              private trailPreviewService: TrailPreviewService,
              private activatedRoute: ActivatedRoute,
              private modalService: NgbModal,
              private router: Router) {
  }

  ngOnInit(): void {
    this.realm = this.authService.getInstanceRealm();
    this.onPlaceLoad(1);
    this.onLoadTrailMap();
  }

  private onPlaceLoad(page: number) {
    this.placeService.get(
        PaginationUtils.getLowerBound(page, this.entryPerPage),
        PaginationUtils.getUpperBound(page, this.entryPerPage),
        this.realm, true)
        .subscribe(resp => {
          this.placeList = resp.content;
          this.totalPlaces = resp.totalCount;
          this.selectedPage = page;
        });
  }

  onEdit(id: string) {
    this.router.navigate(
        ["/admin/place-management/edit/" + id], {
          relativeTo: this.activatedRoute,
        });
  }

  formatStringDateToDashes(uploadedOn: string) {
    return DateUtils.formatDateToDay(uploadedOn);
  }

  onPreview(placeDto: PlaceDto) {
    this.placePreview = placeDto
    this.trailsPreview = [];
    this.markersPreview = [];

    this.markersPreview = placeDto.coordinates.map(c => {
      return {
        color: "black",
        icon: MapPinIconType.PIN,
        coords: {longitude: c.longitude, latitude: c.latitude}
      }
    });
    placeDto.crossingTrailIds.forEach((trailId) => {
      this.trailService.getTrailById(trailId).subscribe((resp) => {
        resp.content.forEach((r) => this.trailsPreview.push(r));
      })
    });
    this.togglePreview();
  }

  togglePreview() {
    this.isPlacePreviewVisible = !this.isPlacePreviewVisible;
  }

  showTrailCode(crossingTrailIds: string[]) {
    const trails = crossingTrailIds.map(it => this.trailMap.get(it));
    const trailsHtml = trails.map((it => `<li>${it}</li>`)).join("");
    this.openError("Sentieri passanti per " + (crossingTrailIds.length > 1 ? "bivio" : "località"),
        "<p>Sentieri:</p><ul>" + trailsHtml + "</ul>");
  }

  private onLoadTrailMap() {
    this.trailPreviewService.getMappings(this.realm)
        .subscribe((resp) => {
          resp.content.forEach(it => this.trailMap.set(it.id, it.code));
        });
  }

  private openError(title: string, body: string) {
    const modal = this.modalService.open(InfoModalComponent);
    modal.componentInstance.title = title;
    modal.componentInstance.body = body;
  }
}
