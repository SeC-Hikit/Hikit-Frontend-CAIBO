import {Component, OnInit} from "@angular/core";
import {AuthService} from "src/app/service/auth.service";
import {
    TrailPreviewResponse,
    TrailPreviewService,
} from "src/app/service/trail-preview-service.service";
import {TrailDto, TrailMappingDto, TrailService} from "src/app/service/trail-service.service";
import {Coordinates2D} from "../../../service/geo-trail-service";

@Component({
    selector: "app-poi-add",
    templateUrl: "./poi-add.component.html",
    styleUrls: ["./poi-add.component.scss"],
})
export class PoiAddComponent implements OnInit {

    isTrailListLoaded = false;
    isTrailLoaded = false;

    selectedTrail: TrailDto;
    trailPreviewResponse: TrailPreviewResponse;
    markers: [] = [];


    constructor(
        private trailPreviewService: TrailPreviewService,
        private trailService: TrailService,
        private authService: AuthService
    ) {
    }

    async ngOnInit(): Promise<void> {
        const realm = this.authService.getRealm();
        await this.trailPreviewService
            .getMappings(realm)
            .subscribe((resp) => {
                this.trailPreviewResponse = resp;
                this.isTrailListLoaded = true;
                this.selectFirstTrail(resp.content);
            });
    }

    private selectFirstTrail(trailPreviews: TrailMappingDto[]) {
        if (trailPreviews.length > 0) {
            this.trailService.getTrailById(trailPreviews[0].id)
                .subscribe((resp) => {
                    this.selectedTrail = resp.content[0];
                    this.isTrailLoaded = true;
                });
        }
    }

    onChangeTrail($event: any) {
        const targetId = $event.target.value;
        this.isTrailLoaded = false;
        this.trailService.getTrailById(targetId)
            .subscribe((resp) => {
                this.selectedTrail = resp.content[0];
                this.isTrailLoaded = true;
            });

    }

    onMapClick($event: Coordinates2D) {

    }
}
