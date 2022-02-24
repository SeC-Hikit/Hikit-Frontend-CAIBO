import {Component, OnInit} from "@angular/core";
import {AuthService} from "src/app/service/auth.service";
import {
    TrailPreviewResponse,
    TrailPreviewService,
} from "src/app/service/trail-preview-service.service";
import {TrailDto, TrailMappingDto, TrailService} from "src/app/service/trail-service.service";
import {Coordinates2D} from "../../../service/geo-trail-service";
import {MapPinIconType} from "../../../../assets/icons/MapPinIconType";
import {GeoToolsService} from "../../../service/geotools.service";
import {Marker} from "../../../map-preview/map-preview.component";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {PoiEnums, SelectChoicesMacro, SelectChoicesMicro} from "../PoiEnums";

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
    markers: Marker[] = [];

    macroChoices : SelectChoicesMacro[] = PoiEnums.macroTypes;
    microChoices : SelectChoicesMicro[] = [];

    formGroup: FormGroup = new FormGroup({
        id: new FormControl(""),
        name: new FormControl("", Validators.required),
        tags: new FormControl(""),
        description: new FormControl(""),
        macroType: new FormControl("CULTURAL"),
        microTypes: new FormArray([]),
        coordLongitude: new FormControl("", Validators.required),
        coordLatitude: new FormControl("", Validators.required),
        coordAltitude: new FormControl("", Validators.required),
    });


    constructor(
        private trailPreviewService: TrailPreviewService,
        private trailService: TrailService,
        private authService: AuthService,
        private geoToolService: GeoToolsService
    ) {}

    async ngOnInit(): Promise<void> {
        const realm = this.authService.getRealm();
        await this.trailPreviewService
            .getMappings(realm)
            .subscribe((resp) => {
                this.trailPreviewResponse = resp;
                this.isTrailListLoaded = true;
                this.selectFirstTrail(resp.content);
                this.initializeForm();
                this.populateMicroChoices(this.macroChoices[0].value);
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
        this.eraseFields();
    }

    onMapClick(coords: Coordinates2D) {
        this.markers = [{
            icon: MapPinIconType.PIN,
            coords: coords,
            color: "#1D9566"
        }];
        this.geoToolService.getAltitude(coords).subscribe((resp) => {
            this.formGroup.get("coordLongitude").setValue(resp.longitude);
            this.formGroup.get("coordLatitude").setValue(resp.latitude);
            this.formGroup.get("coordAltitude").setValue(resp.altitude);
        })
    }

    processModule() {

    }

    onMacroSelection($event: any) {
        const value = $event.target.value;
        this.populateMicroChoices(value);
    }

    private populateMicroChoices(value) {
        this.microChoices = this.macroChoices.filter(it => it.value == value)[0].micro;
        while(this.microTypes.controls.length > 0) { this.microTypes.controls.pop() }
        this.microTypes.push(new FormControl(this.microChoices[0].value));
    }

    private eraseFields(){
        this.formGroup.get("coordLongitude").setValue("");
        this.formGroup.get("coordLatitude").setValue("");
        this.formGroup.get("coordAltitude").setValue("");
    }

    get microTypes(): FormArray  {
        return this.formGroup.get("microTypes") as FormArray;
    }

    private initializeForm() {
        this.microTypes.controls.push(new FormControl("Puppa"))
    }

    addMicroGroup() {
        this.microTypes.controls.push(new FormControl("Puppa"))
    }
}
