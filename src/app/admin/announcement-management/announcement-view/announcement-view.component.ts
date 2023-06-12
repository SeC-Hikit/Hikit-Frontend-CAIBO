import { Component, OnInit } from '@angular/core';
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


  constructor(public authService: AuthService,
              public announcementService: AnnouncementService) { }

  ngOnInit(): void {
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
