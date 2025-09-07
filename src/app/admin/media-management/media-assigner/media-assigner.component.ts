import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {TrailService} from "../../../service/trail-service.service";
import {PoiService} from "../../../service/poi-service.service";
import {NotificationService} from "../../../service/notification-service.service";
import {AnnouncementService} from "../../../service/announcement.service";
import {Media, MediaService, MediaTopic} from "../../../service/media-service.service";
import {AdminMaintenanceService} from "../../../service/admin-maintenance.service";
import {PlaceService} from "../../../service/place.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PaginationUtils} from "../../../utils/PaginationUtils";
import {InfoModalComponent} from "../../../modal/info-modal/info-modal.component";

@Component({
    selector: 'app-media-assigner',
    templateUrl: './media-assigner.component.html',
    styleUrls: ['./media-assigner.component.scss']
})
export class MediaAssignerComponent implements OnInit {

    public name: String;
    public description: String;
    isLoading: boolean = true;

    public page: number;
    public entryPerPage = 10;
    public medias: Media[] = [];
    public totalMedia: number;
    public realm: string;

    public selectedMedias: Media[] = [];

    constructor(private activatedRoute: ActivatedRoute,
                private trailService: TrailService,
                private poiService: PoiService,
                private notificationService: NotificationService,
                private placeService: PlaceService,
                private announcementService: AnnouncementService,
                private maintenanceService: AdminMaintenanceService,
                private modalService: NgbModal,
                public mediaService: MediaService,
    ) {
    }

    ngOnInit(): void {
        // related topic from load
        const relatedTopic: string = this.activatedRoute.snapshot.paramMap.get("relatedTopic");
        const relatedTopicId: string = this.activatedRoute.snapshot.paramMap.get("relatedTopicId");

        this.mediaService.get(0, this.entryPerPage,
            this.realm).subscribe((it) => {
            this.medias = it.content;
            this.totalMedia = it.totalCount
            this.page = it.currentPage
        })

        switch (relatedTopic) {
            case MediaTopic.ACCESSIBILITY_NOTIFICATION:
                this.name = "accessibilità";
                this.notificationService.getById(relatedTopicId).subscribe((it) => {
                    const notification = it.content[0]
                    this.trailService.getTrailById(notification.trailId).subscribe((tr) => {
                        let trail = tr.content[0];
                        this.description = `per notifica con descrizione: ${notification.description} su sentiero ${trail.code}`
                    })
                })
                break;
            case MediaTopic.MAINTENANCE:
                this.name = "manutenzione";
                this.description = `per manutenzione con id: ${relatedTopicId}`
                // todo
                break;
            case MediaTopic.TRAIL:
                this.name = "sentiero";
                this.trailService.getTrailById(relatedTopicId).subscribe((tr) => {
                    let trail = tr.content[0];
                    this.description = `per sentiero con codice: ${trail.code}, ${trail.startLocation.name}-${trail.endLocation.name}`
                })
                break;
            case MediaTopic.POI:
                this.name = "punto d'interesse";
                this.poiService.getById(relatedTopicId).subscribe((pois) => {
                    let poi = pois.content[0];
                    this.description = `per poi: ${poi.name}, Tipo: ${poi.macroType}, e microtipi: ${poi.microType.join(",")}`
                })
                break;
            case MediaTopic.PLACE:
                this.name = "località/bivio";
                this.placeService.getById(relatedTopicId).subscribe((pl) => {
                    let place = pl.content[0];
                    this.description = `per località: ${place.name}}`
                })
                break;
            case MediaTopic.ANNOUNCEMENT:
                this.name = "annuncio";
                this.announcementService.getAnnouncementById(relatedTopicId).subscribe((an) => {
                    let ann = an.content[0];
                    this.description = `per annuncio: ${ann.id}}`
                })
                break;
            default:
                new Error()
        }

        this.isLoading = false;
    }

    loadPage(page: number) {
        PaginationUtils.up();
        this.page = page;
        this.mediaService.get(
            PaginationUtils.getLowerBound(page, this.entryPerPage),
            PaginationUtils.getUpperBound(page, this.entryPerPage),
            this.realm).subscribe(resp => {
            this.medias = resp.content;
            this.totalMedia = resp.totalCount
            this.page = resp.currentPage
        });
    }

    openPreview(media: Media) {
        this.isLoading = true;
        const id = media.id;
        const elected = this.medias.filter(it => it.id == id)[0]
        this.modalOpen(`Anteprima di ${elected.name}: `,
            `<div class='col-12'>
                    <div class="img-preview">
                    <img src='${elected.fileUrl + "_l" + "." + elected.extension}' width='300'/>
                   </div>
                </div>`)
    }

    private modalOpen(title: string, body: string) {
        this.isLoading = false;
        const modal = this.modalService.open(InfoModalComponent, {scrollable : true});
        modal.componentInstance.title = title;
        modal.componentInstance.body = body;
    }


    onSelect(media: Media) {
        if (this.selectedMedias.indexOf(media) == -1) {
            this.selectedMedias.push(media)
        } else {
            this.modalOpen("Elemento già inserito", "Media già assegnato")
        }
    }
}
