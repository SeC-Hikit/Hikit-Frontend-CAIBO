import {Component, OnInit} from '@angular/core';
import {Marker} from "../../../map-preview/map-preview.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AdminPlaceService} from "../../../service/admin-place.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../service/auth.service";
import {PlaceDto, PlaceService} from "../../../service/place.service";
import {TrailPreviewService} from "../../../service/trail-preview-service.service";

@Component({
    selector: 'app-place-edit',
    templateUrl: './place-edit.component.html',
    styleUrls: ['./place-edit.component.scss']
})
export class PlaceEditComponent implements OnInit {

    isLoading: boolean = true;
    isPreviewVisible: boolean = false;

    trailMap: Map<string, string> = new Map();

    errors = [];
    markers: Marker[] = [];

    place: PlaceDto;
    formGroup: FormGroup;

    private realm: string;

    constructor(private placeService: PlaceService,
                private adminPlaceService: AdminPlaceService,
                private trailPreviewService: TrailPreviewService,
                private routerService: Router,
                private activatedRoute: ActivatedRoute,
                private authService: AuthService) {

        this.formGroup = new FormGroup({
            id: new FormControl(""),
            name: new FormControl("", Validators.required),
            tags: new FormControl(""),
            description: new FormControl("")
        });

        this.realm = authService.getRealm();
        this.trailPreviewService.getMappings("")

    }

    ngOnInit(): void {
        const idFromPath: string = this.activatedRoute.snapshot.paramMap.get("id");
        this.loadPlace(idFromPath);
    }

    processModule() {
        this.place.tags = this.formGroup.get("tags").value.split(",").map(it=>it.trim());
        this.place.description = this.formGroup.get("description").value;

        this.adminPlaceService.update(this.place).subscribe((it) => {
            if(it.status == "OK") {
                this.routerService.navigate(["/admin/place-management/view"]);
            }
        })
    }

    private loadPlace(idFromPath: string) {
        this.trailPreviewService.getMappings(this.realm).subscribe((it)=> {
            it.content.forEach(it => this.trailMap.set(it.id, it.code));
        });
        this.placeService.getById(idFromPath).subscribe((it)=> {
            if(it.content.length == 0) {
                return;
            }
            this.place = it.content[0];
            this.formGroup.get("id").setValue(this.place.id);
            this.formGroup.get("name").setValue(this.place.name);
            this.formGroup.get("description").setValue(this.place.description);
            this.formGroup.get("tags").setValue(this.place.tags.join(", "));
            this.isLoading = false;
        })
    }

    togglePreview() {
        this.isPreviewVisible = !this.isPreviewVisible;
    }

    getTrailCode(crossingId: string) : string {
        return this.trailMap.get(crossingId);
    }
}
