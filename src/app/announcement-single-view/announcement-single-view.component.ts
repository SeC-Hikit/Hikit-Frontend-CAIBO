import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AnnouncementDto, AnnouncementService} from "../service/announcement.service";
import {DateUtils} from "../utils/DateUtils";
import {TrailPreviewService} from "../service/trail-preview-service.service";

@Component({
    selector: 'app-announcement-single-view',
    templateUrl: './announcement-single-view.component.html',
    styleUrls: ['./announcement-single-view.component.scss']
})
export class AnnouncementSingleViewComponent implements OnInit {
    isLoading = true;
    announcement: AnnouncementDto = null;
    announcementTopicTypes = AnnouncementService.relatedElementTypes;
    referralText: string = "";

    constructor(private activatedRoute: ActivatedRoute,
                private router: Router,
                private announcementService: AnnouncementService,
                private trailService: TrailPreviewService) {
    }

    ngOnInit(): void {
        const idFromPath: string = this.activatedRoute.snapshot.paramMap.get("id");
        if (!idFromPath) {
            this.bounceToAnnouncementPage();
        }
        this.loadAnnouncement(idFromPath)
    }

    private bounceToAnnouncementPage() {
        this.router.navigate(["/announcement"])
    }

    private loadAnnouncement(idFromPath: string) {
        this.announcementService.getAnnouncementById(idFromPath).subscribe((it) => {
            if (it.content.length == 0) {
                this.bounceToAnnouncementPage();
            }

            const contentElement = it.content[0];
            this.announcement = contentElement
            this.composeReferralText(contentElement)
        }, () => this.bounceToAnnouncementPage(), () => {
            this.isLoading = false;
        })
    }

    private composeReferralText(contentElement: AnnouncementDto): string {
        let isTrail = contentElement.relatedTopic.announcementTopicType == "TRAIL";
        if (isTrail) {
            this.trailService.getPreview(contentElement.relatedTopic.id).subscribe(
                (it) => {
                    const targetTrail = it.content[0];
                    this.referralText = `sentiero <a href="/map?trail=${targetTrail.id}"><span class='clickable white-font trailCodeColumn'>${targetTrail.code}</span></a>`
                });
            return;
        }
        this.referralText = this.getTopicType(contentElement.relatedTopic.announcementTopicType)
    }

    getTopicType(announcementTopicType: string) {
        return this.announcementTopicTypes.filter(it => it.value == announcementTopicType)[0].name;
    }

    formatDate(uploadedOn: string) {
        return DateUtils.formatDateToDay(uploadedOn);
    }

    onBack() {
        this.router.navigate(["/announcements"])
    }
}
