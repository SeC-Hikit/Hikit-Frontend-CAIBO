import {Component, OnInit} from '@angular/core';
import {AnnouncementDto, AnnouncementService} from "../../../service/announcement.service";
import {AuthService} from "../../../service/auth.service";
import {DateUtils} from "../../../utils/DateUtils";
import {AdminAnnouncementService} from "../../../service/admin-announcement.service";
import {Router} from "@angular/router";
import {PaginationUtils} from "../../../utils/PaginationUtils";

@Component({
    selector: 'app-announcement-view',
    templateUrl: './announcement-view.component.html',
    styleUrls: ['./announcement-view.component.scss']
})
export class AnnouncementViewComponent implements OnInit {

    realm = "";
    entryPerPage = 10;
    totalAnnouncements = 0;
    selectedPage: number = 0;

    announcementList: AnnouncementDto[] = [];
    isLoading: boolean = false;


    constructor(public authService: AuthService,
                public announcementService: AnnouncementService,
                public adminAnnouncementService: AdminAnnouncementService,
                private routerService: Router) {
    }

    ngOnInit(): void {
        this.realm = this.authService.getInstanceRealm();
        this.onAnnouncementLoad();
    }

    onAnnouncementLoad(page: number = 1) {
        this.isLoading = true;
        this.announcementService.getAnnouncements(
            PaginationUtils.getLowerBound(page, this.entryPerPage),
            PaginationUtils.getUpperBound(page, this.entryPerPage)
            , this.realm)
            .subscribe((it) => {
                this.announcementList = it.content;
                this.isLoading = false;
                this.totalAnnouncements = it.totalCount;
                this.selectedPage = it.currentPage;
            }, (_) => {
            }, () => {
                this.isLoading = false;
            })

    }

    onPreview(announcement: any) {

    }

    onEdit(id) {
        this.routerService.navigate(["/admin/announcement-management/edit/" + id])
    }

    onDeleteClick(announcement) {
        this.adminAnnouncementService
            .deleteById(announcement.id)
            .subscribe((it) => {
                this.onAnnouncementLoad(this.selectedPage);
            })
    }

    formatDate(uploadedOn: string) {
        return DateUtils.formatDateToDay(uploadedOn);
    }
}
