import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {Subject} from "rxjs";
import * as moment from "moment";
import {TrailRawDto} from "../../../service/import.service";
import {FileDetailsDto, TrailDto, TrailService} from "../../../service/trail-service.service";
import {TrailImportFormUtils} from "../../../utils/TrailImportFormUtils";
import {AuthService} from "../../../service/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AdminTrailRawService} from "../../../service/admin-trail-raw.service";
import {AdminTrailService} from "../../../service/admin-trail.service";

@Component({
    selector: 'app-trail-modify-management',
    templateUrl: './trail-modify-management.component.html',
    styleUrls: ['./trail-modify-management.component.scss']
})
export class TrailModifyManagementComponent implements OnInit {

    trailFormGroup: FormGroup;
    date: NgbDateStruct;

    trailDto: TrailDto;
    fileDetails: FileDetailsDto;

    isLoading = false;
    isError: boolean;
    isPreviewVisible = false;

    private destroy$ = new Subject();
    today = moment()
    maxDate: NgbDateStruct = {
        year: this.today.year(),
        month: this.today.month() + 1,
        day: this.today.date()
    };

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private authHelper: AuthService,
        private trailService: TrailService,
        private adminTrailService: AdminTrailService) {
    }

    ngOnInit(): void {
        this.trailFormGroup = new FormGroup({
            code: new FormControl("", Validators.required),
            officialEta: new FormControl(""),
            name: new FormControl(""),
            classification: new FormControl("T", Validators.required),
            description: new FormControl("", Validators.required),
            lastUpdate: new FormControl(""),
            maintainingSection: new FormControl(this.authHelper.getSection(), Validators.required),
        });

        const idFromPath: string = this.route.snapshot.paramMap.get("id");
        this.loadRaw(idFromPath);
    }

    loadRaw(idFromPath: string) {
        this.isLoading = true;
        this.trailService.getTrailById(idFromPath)
            .subscribe((response) => {
                if (response.content.length == 0) {
                    alert("No trail found with id " + idFromPath);
                    this.isError = true;
                    return;
                }
                this.trailDto = response.content[0];
                this.fileDetails = this.trailDto.fileDetails;
                this.populateForm(this.trailDto);
                this.isLoading = false;
            });
    }

    private populateForm(tpm: TrailDto) {
            this.trailFormGroup.controls["officialEta"].setValue(0);
            this.trailFormGroup.controls["code"].setValue(tpm.name);
            this.trailFormGroup.controls["description"].setValue(tpm.description);
            this.trailFormGroup.controls["name"].setValue(tpm.name);
            this.trailFormGroup.controls["classification"].setValue(tpm.classification);
            this.trailFormGroup.controls["lastUpdate"].setValue(tpm.lastUpdate);
            this.trailFormGroup.controls["maintainingSection"].setValue(tpm.maintainingSection);
    }

    processForm() {

    }

    togglePreview() {
        this.isPreviewVisible = !this.isPreviewVisible;
    }

}
