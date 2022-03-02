import {Component, OnInit} from "@angular/core";
import {AuthService} from "src/app/service/auth.service";
import {TrailPreview, TrailPreviewService,} from "src/app/service/trail-preview-service.service";
import {TrailDto, TrailService} from "src/app/service/trail-service.service";
import {Coordinates2D} from "../../../service/geo-trail-service";
import {MapPinIconType} from "../../../../assets/icons/MapPinIconType";
import {GeoToolsService} from "../../../service/geotools.service";
import {Marker} from "../../../map-preview/map-preview.component";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {PoiEnums, SelectChoicesMacro, SelectChoicesMicro} from "../PoiEnums";
import {environment} from "../../../../environments/environment.prod";
import {AdminPoiService} from "../../../service/admin-poi-service.service";
import * as moment from "moment";
import {KeyValueDto, PoiDto, PoiService} from "../../../service/poi-service.service";
import {Status} from "../../../Status";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TrailRawDto} from "../../../service/import.service";
import {InfoModalComponent} from "../../../modal/info-modal/info-modal.component";

@Component({
    selector: "app-poi-add",
    templateUrl: "./poi-add.component.html",
    styleUrls: ["./poi-add.component.scss"],
})
export class PoiAddComponent implements OnInit {

    isModify = false;

    hasFormBeenInitialized = false;
    isTrailListLoaded = false;
    isTrailLoaded = false;
    isLoading: boolean = false;

    selectedTrails: TrailDto[] = [];
    trailPreviewResponseContent: TrailPreview[] = [];
    markers: Marker[] = [];

    macroChoices: SelectChoicesMacro[] = PoiEnums.macroTypes;
    microChoices: SelectChoicesMicro[] = [];

    formGroup: FormGroup = new FormGroup({
        id: new FormControl(""),
        name: new FormControl("", Validators.required),
        trailIds: new FormArray([]),
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
        private poiService: PoiService,
        private trailService: TrailService,
        private authService: AuthService,
        private geoToolService: GeoToolsService,
        private routerService: Router,
        private activatedRoute: ActivatedRoute,
        private modalService: NgbModal
    ) {
    }

    async ngOnInit(): Promise<void> {
        this.hasFormBeenInitialized = false;

        const idFromPath: string = this.activatedRoute.snapshot.paramMap.get("id");
        const realm = this.authService.getRealm();
        this.populateMicroChoices(this.macroChoices[0].value);

        if (idFromPath == null) {
            this.microTypes.push(new FormControl(this.microChoices[0].value));
            await this.trailPreviewService
                .getMappings(realm)
                .subscribe((resp) => {
                    this.trailPreviewResponseContent = resp.content;
                    this.isTrailListLoaded = true;
                    this.addTrailId();
                    this.loadFirstTrailInMappingLoadedList(resp.content);
                    this.hasFormBeenInitialized = true;
                });
        } else {
            this.isModify = true;
            this.trailPreviewService
                .getMappings(realm)
                .subscribe((resp) => {
                    this.trailPreviewResponseContent = resp.content;
                    this.isTrailListLoaded = true;
                    this.load(idFromPath);
                    this.hasFormBeenInitialized = true;
                })
        }
    }

    private loadFirstTrailInMappingLoadedList(resp: TrailPreview[]) {
        if (resp.length > 0) {
            this.isTrailLoaded = false;
            this.trailService.getTrailById((resp)[0].id)
                .subscribe((resp) => {
                    this.selectedTrails = this.selectedTrails.concat(resp.content);
                    this.isTrailLoaded = true;
                });
        }
    }

    onChangeTrail($event: any, i: number) {
        const targetId = $event.target.value;
        this.getTrailIdsByIndex(i).setValue(targetId);
        this.isTrailLoaded = false;
        this.trailService.getTrailById(targetId)
            .subscribe((resp) => {
                this.selectedTrails[i] = resp.content[0];
                this.selectedTrails = [...this.selectedTrails];
                this.isTrailLoaded = true;
            });
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

        const id = this.formGroup.get("id").value;
        const macroType = this.formGroup.get("macroType").value;
        const microType = this.formGroup.get("microTypes").value;
        const tagsFormValue = this.formGroup.get("tags").value;
        const externalResources = this.formGroup.get("externalResources").value;
        const keyVals: KeyValueDto[] = tagsFormValue
            .map(it => {
                let splitValue = it.split(",");
                let key = splitValue[0];
                let value = splitValue[1];
                return {
                    key: key,
                    value: value
                };
            });
        const trailIds = this.selectedTrails.map(it => it.id);

        this.authService.getUsername().then((name) => {
            const poi: PoiDto = {
                id: id == "" ? null : id,
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

            this.isLoading = true;
            if (this.isModify) {
                this.update(poi);
                return;
            }
            this.create(poi);
        });


    }

    private update(poi: PoiDto) {
        this.poiAdminService.update(poi).subscribe((resp) => {
            if (resp.status == Status.OK) {
                this.isLoading = false;
                this.routerService.navigate(["/admin/poi-management"]);
                return;
            }
            this.noticeErrorModal(resp.messages);
        });
    }

    private create(poi: PoiDto) {
        this.poiAdminService.create(poi).subscribe((resp) => {
            this.isLoading = false;
            if (resp.status == Status.OK) {
                this.routerService.navigate(["/admin/poi-management"])
                return;
            }
            this.noticeErrorModal(resp.messages);
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

    get trailIds(): FormArray {
        return this.formGroup.get("trailIds") as FormArray;
    }

    getMicroType(index: number): FormControl {
        return this.microTypes.controls[index] as FormControl;
    }

    addMicroGroup() {
        this.microTypes.controls
            .push(new FormControl(this.microChoices[0].name));
        return false;
    }

    addTrailId() {
        this.trailIds.controls
            .push(new FormControl(this.trailPreviewResponseContent[0].id));
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

    getTrailIdsByIndex(index: number): FormControl {
        return this.trailIds.controls[index] as FormControl;
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

    private load(idFromPath: string) {
        this.poiService.getById(idFromPath).subscribe((resp) => {

            let mapOfPromises = resp.content[0].trailIds.map(it => this.trailService.getTrailById(it).toPromise());
            Promise.all(mapOfPromises).then((trailResp) => {

                this.selectedTrails = trailResp.flatMap(it => it.content);

                const poiDto = resp.content[0];
                if (resp.size == 0) {
                    alert("Error");
                }

                this.formGroup.get("macroType").setValue(poiDto.macroType);

                let microTypesFA = this.formGroup.get("microTypes") as FormArray;
                let tagsFA = this.formGroup.get("tags") as FormArray;
                let externalResourcesFA = this.formGroup.get("externalResources") as FormArray;
                let trailIdsFA = this.formGroup.get("trailIds") as FormArray;

                poiDto.microType.forEach((it) => {
                    microTypesFA.push(new FormControl(it))
                })

                poiDto.tags.forEach((it) => {
                    tagsFA.push(new FormControl(it));
                });

                poiDto.externalResources.forEach((it) => {
                    externalResourcesFA.push(new FormControl(it))
                })

                poiDto.trailIds.forEach((it) => {
                    trailIdsFA.push(new FormControl(it))
                })

                this.formGroup.get("id").setValue(poiDto.id);
                this.formGroup.get("name").setValue(poiDto.name);
                this.formGroup.get("description").setValue(poiDto.description);
                this.formGroup.get("coordLongitude").setValue(poiDto.coordinates.longitude);
                this.formGroup.get("coordLatitude").setValue(poiDto.coordinates.latitude);
                this.formGroup.get("coordAltitude").setValue(poiDto.coordinates.altitude);

                this.isTrailLoaded = true;

            })
        });
    }

    private noticeErrorModal(errors: string[]) {
        const modal = this.modalService.open(InfoModalComponent);
        modal.componentInstance.title = `Errore nel salvataggio del POI`;
        const errorsString = errors.join("<br>")
        modal.componentInstance.body = `<ul>I seguenti errori imepdiscono il salvataggio: <br/>${errorsString}</ul>`;
    }


    addTrail() {
        this.trailIds.push(new FormControl(this.trailPreviewResponseContent[0].id));
        this.loadFirstTrailInMappingLoadedList(this.trailPreviewResponseContent);
        return false;
    }

    onDeleteTrail(i: number) {
        this.selectedTrails.splice(i, 1);
        this.selectedTrails = [...this.selectedTrails];
        this.trailIds.controls.splice(i, 1);
    }
}
