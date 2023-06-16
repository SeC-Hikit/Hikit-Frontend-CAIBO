import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AnnouncementDto, AnnouncementService} from "../service/announcement.service";
import {DateUtils} from "../utils/DateUtils";

@Component({
    selector: 'app-announcement-single-view',
    templateUrl: './announcement-single-view.component.html',
    styleUrls: ['./announcement-single-view.component.scss']
})
export class AnnouncementSingleViewComponent implements OnInit {
    isLoading = true;
    announcement: AnnouncementDto = null;

    constructor(private activatedRoute: ActivatedRoute,
                private router: Router,
                private announcementService: AnnouncementService) {
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

            this.announcement = it.content[0]
        }, () => this.bounceToAnnouncementPage(), () => {
            this.isLoading = false;
        })
    }

    formatDate(uploadedOn: string) {
        return DateUtils.formatDateToDay(uploadedOn);
    }

    onBack() {
        this.router.navigate(["/announcements"])
    }
}
