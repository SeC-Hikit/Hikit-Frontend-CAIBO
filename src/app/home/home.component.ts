import {Component, OnInit} from '@angular/core';
import {GraphicUtils} from '../utils/GraphicUtils';
import {AnnouncementDto, AnnouncementService} from "../service/announcement.service";
import {AuthService} from "../service/auth.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    announcementsList: AnnouncementDto[] = []

    static HOME_ID: string = "image";

    constructor(private announcementService: AnnouncementService,
                private routerService: Router,
                private authService: AuthService) {

    }

    ngOnInit(): void {
        this.announcementService.getAnnouncements(
            0, 5,
            this.authService.getInstanceRealm()).subscribe((it) => {
            this.announcementsList = it.content;
        })
    }

    ngAfterViewInit(): void {
        let menuHeight = GraphicUtils.getMenuHeight();
        let fullSizeWOBorder = GraphicUtils.getFullHeightSizeWOMenuImage();
        document.getElementById(HomeComponent.HOME_ID).style.minHeight = fullSizeWOBorder.toString() + "px";
        document.getElementById("holder").style.minHeight = (fullSizeWOBorder - menuHeight).toString() + "px";
    }

    getIcon(type: "EVENT" | "INFO" | "WARNING" | "EMERGENCY") {
        switch (type) {
            case "EVENT":
                return `<svg class="bi clickable" width="24" *ngIf="true" height="24" fill="currentColor"><use xlink:href="/assets/bootstrap-icons/bootstrap-icons.svg#calendar-check-fill"/></svg>`
            case "WARNING":
                return `<svg class="bi clickable" width="24" *ngIf="true" height="24" fill="currentColor"><use xlink:href="/assets/bootstrap-icons/bootstrap-icons.svg#exclamation-circle-fill"/></svg>`
            case "EMERGENCY":
                return `<svg class="bi clickable" width="24" *ngIf="true" height="24" fill="currentColor"><use xlink:href="/assets/bootstrap-icons/bootstrap-icons.svg#exclamation-octagon-fill"/></svg>`
            default:
                return `<svg class="bi clickable" width="24" *ngIf="true" height="24" fill="currentColor"><use xlink:href="/assets/bootstrap-icons/bootstrap-icons.svg#info-circle-fill"/></svg>`
        }

    }

    navigateToAnnouncement(id: string) {
        this.routerService.navigate([`/announcements/${id}`])
    }
}
