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

    isLoading = true;
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
        this.loadTrail(idFromPath);
    }

    loadTrail(idFromPath: string) {
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
        const trailRecordDate = moment(tpm.lastUpdate);

        this.date = {
            year: trailRecordDate.year(),
            month: trailRecordDate.month() + 1,
            day: trailRecordDate.date()
        };

        this.trailFormGroup.controls["officialEta"].setValue(tpm.officialEta);
        this.trailFormGroup.controls["code"].setValue(tpm.code);
        this.trailFormGroup.controls["description"].setValue(tpm.description);
        this.trailFormGroup.controls["name"].setValue(tpm.name);
        this.trailFormGroup.controls["classification"].setValue(tpm.classification);
        this.trailFormGroup.controls["lastUpdate"].setValue(tpm.lastUpdate);
        this.trailFormGroup.controls["maintainingSection"].setValue(tpm.maintainingSection);
    }

    onModify() {

        const trailDto = this.trailDto;
        trailDto.officialEta = this.trailFormGroup.controls["officialEta"].value;
        trailDto.code = this.trailFormGroup.controls["code"].value;
        trailDto.description = this.trailFormGroup.controls["description"].value;
        trailDto.name = this.trailFormGroup.controls["name"].value;
        trailDto.classification = this.trailFormGroup.controls["classification"].value;
        trailDto.lastUpdate = moment(`${this.date.year}-${this.date.month}-${this.date.day}`,
            'YYYY-MM-DD').toDate().toISOString();
        trailDto.maintainingSection = this.trailFormGroup.controls["maintainingSection"].value;

        this.adminTrailService.updateTrail(trailDto).subscribe(it => {
            if (it.content.length > 0) {
                this.ensureStatusOkNavigation(it.content[0]);
            }
        });
    }

    private ensureStatusOkNavigation(it: TrailDto) {
        this.router.navigate([
            "admin/trail-management/view",
            {
                success: it.code
            },
        ]);
    }



    togglePreview() {
        this.isPreviewVisible = !this.isPreviewVisible;
    }
}
