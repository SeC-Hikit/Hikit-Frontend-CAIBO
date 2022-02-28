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
import {environment} from "../../../../environments/environment.prod";
import {AdminPoiService} from "../../../service/admin-poi-service.service";
import * as moment from "moment";
import {KeyValueDto, PoiDto} from "../../../service/poi-service.service";
import {Status} from "../../../Status";
import {ActivatedRoute, Router} from "@angular/router";

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

    macroChoices: SelectChoicesMacro[] = PoiEnums.macroTypes;
    microChoices: SelectChoicesMicro[] = [];

    formGroup: FormGroup = new FormGroup({
        id: new FormControl(""),
        name: new FormControl("", Validators.required),
        tags: new FormArray([]),
        description: new FormControl(""),
        macroType: new FormControl("CULTURAL"),
        microTypes: new FormArray([]),
        externalResources: new FormArray([]),
        coordLongitude: new FormControl("", Validators.required),
        coordLatitude: new FormControl("", Validators.required),
        coordAltitude: new FormControl("", Validators.required),
    });

    validationErrors: string[] = [];


    constructor(
        private trailPreviewService: TrailPreviewService,
        private poiAdminService: AdminPoiService,
        private trailService: TrailService,
        private authService: AuthService,
        private geoToolService: GeoToolsService,
        private routerService: Router,
        private activatedRoute: ActivatedRoute,
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

        let macroType = this.formGroup.get("macroType").value;
        let microType = this.formGroup.get("microTypes").value;
        let tagsFormValue = this.formGroup.get("tags").value;
        let externalResources = this.formGroup.get("externalResources").value;

        let keyVals: KeyValueDto[] = tagsFormValue
            .map(it => {
                let splitValue = it.split(",");
                let key = splitValue[0];
                let value = splitValue[1];
                return {
                    key: key,
                    value: value
                };
            })
        let trailIds = [this.selectedTrail.id];

        this.authService.getUsername().then((name) => {

            const poi: PoiDto = {
                id: null,
                description: this.formGroup.get("description").value,
                name: this.formGroup.get("name").value,
                tags: tagsFormValue,
                coordinates: {
                    longitude: this.formGroup.get("coordLongitude").value,
                    latitude: this.formGroup.get("coordLatitude").value,
                    altitude: this.formGroup.get("coordAltitude").value
                },
                macroType: macroType,
                microType: microType,
                createdOn: new Date().toISOString(),
                keyVal: keyVals,
                trailIds: trailIds,
                mediaList: [],
                recordDetails: {
                    uploadedOn: moment().toDate().toISOString(),
                    uploadedBy: name,
                    realm: this.authService.getRealm(),
                    onInstance: environment.instance
                },
                externalResources: externalResources
            }

            if (this.validateErrors(poi).length > 0 || !this.formGroup.valid) {
                this.validationErrors.push("Alcuni errori sono presenti nei campi")
                return false;
            }

            this.poiAdminService.create(poi).subscribe((resp) => {
                if (resp.status == Status.OK) {
                    this.routerService.navigate(["/admin/poi-management"])
                }
            });
        });


    }

    onMacroSelection($event: any) {
        const value = $event.target.value;
        this.populateMicroChoices(value);
    }

    private populateMicroChoices(value) {
        this.microChoices = this.macroChoices.filter(it => it.value == value)[0].micro;
        while (this.microTypes.controls.length > 0) {
            this.microTypes.controls.pop()
        }
        this.microTypes.push(new FormControl(this.microChoices[0].value));
    }

    private eraseFields() {
        this.formGroup.get("coordLongitude").setValue("");
        this.formGroup.get("coordLatitude").setValue("");
        this.formGroup.get("coordAltitude").setValue("");
    }

    get microTypes(): FormArray {
        return this.formGroup.get("microTypes") as FormArray;
    }

    get tags(): FormArray {
        return this.formGroup.get("tags") as FormArray;
    }

    get externalResources(): FormArray {
        return this.formGroup.get("externalResources") as FormArray;
    }

    getMicroType(index: number): FormControl {
        return this.microTypes.controls[index] as FormControl;
    }

    private initializeForm() {
        this.microTypes.controls.push(new FormControl("Puppa"))
    }

    addMicroGroup() {
        this.microTypes.controls.push(new FormControl("Puppa"))
        return false;
    }

    addTags() {
        this.tags.push(new FormControl(","))
        return false;
    }

    addExternalResources() {
        this.externalResources.push(new FormControl(""))
        return false;
    }

    getExternalResource(index: number): FormControl {
        return this.externalResources.controls[index] as FormControl;
    }

    onDeleteMicroType(i: number) {
        this.microTypes.controls.splice(i, 1)
    }

    onDeleteTags(i: number) {
        this.tags.controls.splice(i, 1)
    }

    onDeleteExternalResource(i: number) {
        this.externalResources.controls.splice(i, 1)
    }

    onChangeKey($event: any, i: number) {
        let inputValue = $event.target.value.toLowerCase();
        let splitValue = this.tags.controls[i].value.split(",");
        const value = inputValue + "," + splitValue[1];
        this.tags.controls[i].setValue(value);
    }

    onChangeValue($event: any, i: number) {
        let inputValue = $event.target.value.toLowerCase();
        let splitValue = this.tags.controls[i].value.split(",");
        const value = splitValue[0] + "," + inputValue;
        this.tags.controls[i].setValue(value);
    }

    private validateErrors(poi: PoiDto) {
        const errors: string[] = []
        if (poi.name == "") errors.push("Campo 'nome' vuoto");
        this.validationErrors = errors;
        return errors;
    }
}
