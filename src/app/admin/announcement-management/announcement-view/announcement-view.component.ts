import {Component, OnInit} from '@angular/core';
import {AnnouncementDto, AnnouncementService} from "../../../service/announcement.service";
import {AuthService} from "../../../service/auth.service";

@Component({
    selector: 'app-announcement-view',
    templateUrl: './announcement-view.component.html',
    styleUrls: ['./announcement-view.component.scss']
})
export class AnnouncementViewComponent implements OnInit {

    realm = "";
    entryPerPage = 10;
    totalPlaces = 0;
    selectedPage: number = 0;

    announcementList: AnnouncementDto[] = [];
    isLoading: boolean = false;


    constructor(public authService: AuthService,
                public announcementService: AnnouncementService) {
    }

    ngOnInit(): void {
        this.realm = this.authService.getInstanceRealm();
        this.loadAnnouncement();
    }

    private loadAnnouncement() {
        this.isLoading = true;
        this.announcementService.getAnnouncements(0, 10, this.realm)
            .subscribe((it) => {
                this.announcementList = it.content;
                this.isLoading = false;
            }, (_) => {
            }, () => {
                this.isLoading = false;
            })
    }

    onAnnouncementLoad($event: number) {

    }

    onPreview(announcement: any) {

    }

    onEdit(id) {

    }

    onDeleteClick(announcement) {

    }
}
