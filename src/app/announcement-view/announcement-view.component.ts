import { Component, OnInit } from '@angular/core';
import {AnnouncementDto, AnnouncementService} from "../service/announcement.service";
import {AuthService} from "../service/auth.service";
import {AdminAnnouncementService} from "../service/admin-announcement.service";
import {Router} from "@angular/router";
import {PaginationUtils} from "../utils/PaginationUtils";
import {DateUtils} from "../utils/DateUtils";

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

  announcementTypes = AnnouncementService.announcementTypes;
  announcementTopicTypes = AnnouncementService.relatedElementTypes;
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

  formatDate(uploadedOn: string) {
    return DateUtils.formatDateToDay(uploadedOn);
  }

  getType(type: string) {
    return this.announcementTypes.filter(it => it.value == type)[0].name;
  }

  getTopicType(announcementTopicType: string) {
    return this.announcementTopicTypes.filter(it=> it.value == announcementTopicType)[0].name;
  }

  onPreview(announcement) {
    this.routerService.navigate([`/announcements/${announcement.id}`])
  }
}
