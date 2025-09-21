import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {TrailDto, TrailService} from "../../../service/trail-service.service";
import {PoiDto, PoiService} from "../../../service/poi-service.service";
import {AccessibilityNotification, NotificationService} from "../../../service/notification-service.service";
import {AnnouncementDto, AnnouncementService} from "../../../service/announcement.service";
import {LinkedMedia, Media, MediaService, MediaTopic} from "../../../service/media-service.service";
import {AdminMaintenanceService} from "../../../service/admin-maintenance.service";
import {PlaceDto, PlaceService} from "../../../service/place.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PaginationUtils} from "../../../utils/PaginationUtils";
import {InfoModalComponent} from "../../../modal/info-modal/info-modal.component";
import {AdminNotificationService} from "../../../service/admin-notification-service.service";
import {AdminTrailService} from "../../../service/admin-trail.service";
import {AdminPoiService} from "../../../service/admin-poi-service.service";
import {AdminPlaceService} from "../../../service/admin-place.service";
import {Location} from "@angular/common";

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

    private relatedTopic: string;
    private relatedTopicId: string;


    private notification: AccessibilityNotification = null;
    private announcement: AnnouncementDto;
    private trail: TrailDto = null;
    private poi: PoiDto = null;
    private place: PlaceDto = null;

    constructor(private activatedRoute: ActivatedRoute,
                private location: Location,
                private trailService: TrailService,
                private trailServiceAdmin: AdminTrailService,
                private poiService: PoiService,
                private poiServiceAdmin: AdminPoiService,
                private notificationService: NotificationService,
                private notificationServiceAdmin: AdminNotificationService,
                private placeService: PlaceService,
                private placeServiceAdmin: AdminPlaceService,
                private announcementService: AnnouncementService,
                private maintenanceService: AdminMaintenanceService,
                private modalService: NgbModal,
                public mediaService: MediaService,
    ) {
    }

    ngOnInit(): void {
        // related topic from load
        this.relatedTopic = this.activatedRoute.snapshot.paramMap.get("relatedTopic");
        this.relatedTopicId = this.activatedRoute.snapshot.paramMap.get("relatedTopicId");

        this.mediaService.get(0, this.entryPerPage,
            this.realm).subscribe((it) => {
            this.medias = it.content;
            this.totalMedia = it.totalCount
            this.page = it.currentPage
        })

        switch (this.relatedTopic) {
            case MediaTopic.ACCESSIBILITY_NOTIFICATION:
                this.name = "accessibilità";
                this.notificationService.getById(this.relatedTopicId).subscribe((it) => {
                    const notification = it.content[0]
                    this.notification = notification;
                    this.trailService.getTrailById(notification.trailId).subscribe((tr) => {
                        let trail = tr.content[0];
                        this.description = `per notifica con descrizione: ${notification.description} su sentiero ${trail.code}`
                    })
                })
                break;
            case MediaTopic.MAINTENANCE:
                this.name = "manutenzione";
                this.description = `per manutenzione con id: ${this.relatedTopicId}`
                // todo
                break;
            case MediaTopic.TRAIL:
                this.name = "sentiero";
                this.trailService.getTrailById(this.relatedTopicId).subscribe((tr) => {
                    const trail = tr.content[0];
                    this.selectedMedias = trail.mediaList;
                    this.trail = trail;
                    this.description = `per sentiero con codice: ${trail.code}, ${trail.startLocation.name}-${trail.endLocation.name}`
                })
                break;
            case MediaTopic.POI:
                this.name = "punto d'interesse";
                this.poiService.getById(this.relatedTopicId).subscribe((pois) => {
                    const poi = pois.content[0];
                    this.selectedMedias = poi.mediaList;
                    this.poi = poi;
                    this.description = ` poi '${poi.name}', Tipo: ${poi.macroType}, e microtipi: ${poi.microType.join(",")}`
                })
                break;
            case MediaTopic.PLACE:
                this.name = "località/bivio";
                this.placeService.getById(this.relatedTopicId).subscribe((pl) => {
                    let place = pl.content[0];
                    place.mediaIds.map(it => {
                        this.mediaService.getById(it).subscribe(m=> {
                            this.selectedMedias.push(m.content[0]);
                        })
                    });
                    this.place = place;
                    this.description = ` località '${place.name}'`
                })
                break;
            case MediaTopic.ANNOUNCEMENT:
                this.name = "annuncio";
                this.announcementService.getAnnouncementById(this.relatedTopicId).subscribe((an) => {
                    let ann = an.content[0];
                    this.announcement = ann;
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

    save() {
        const selected : LinkedMedia[] = this.selectedMedias.map(it => { return {id: it.id, description: it.name, keyVal:[]}});
        switch (this.relatedTopic) {
            case MediaTopic.ACCESSIBILITY_NOTIFICATION:
                // TODO
                break;
            case MediaTopic.MAINTENANCE:
                // TODO
                break;
            case MediaTopic.TRAIL:
                this.name = "sentiero";
                this.trail.mediaList = selected;
                this.trailServiceAdmin.updateTrail(this.trail).subscribe((tr) => {
                    this.modalOpen("Salvato", "Immagini salvate su sentiero");
                })
                break;
            case MediaTopic.POI:
                this.name = "punto d'interesse";
                this.poi.mediaList = selected;
                this.poiServiceAdmin.update(this.poi).subscribe((pois) => {
                    this.modalOpen("Salvato", "Immagini salvate su POI");
                })
                break;
            case MediaTopic.PLACE:
                this.name = "località/bivio";
                this.place.mediaIds = selected.map(it => it.id);
                this.placeServiceAdmin.update(this.place).subscribe((pl) => {
                    this.modalOpen("Salvato", "Immagini salvate su località-bivio");
                })

                // this.placeServiceAdmin.update(this.place).subscribe((pl) => {
                //     this.modalOpen("Salvato", "Immagini salvate su località-bivio");
                // })
                break;
            case MediaTopic.ANNOUNCEMENT:
                this.name = "annuncio";
                // TODO
                // this.announcementService.getAnnouncementById(this.relatedTopicId).subscribe((an) => {
                //     let ann = an.content[0];
                //
                //     this.description = `per annuncio: ${ann.id}}`
                // })
                break;
            default:
                new Error()
            setTimeout(this.onCancel, 3000)
        }

    }

    onDeleteMedia($event: Media) {
        this.selectedMedias = this.selectedMedias.filter(it => it.id != $event.id);
    }

    onCancel() {
        this.location.back();
    }
}
