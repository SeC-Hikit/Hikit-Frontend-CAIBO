import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import * as moment from 'moment';
import {MaintenanceDto, MaintenanceService} from 'src/app/service/maintenance.service';
import {Status} from 'src/app/Status';
import {TrailPreviewResponse, TrailPreviewService} from 'src/app/service/trail-preview-service.service';
import {Marker} from "../../../map-preview/map-preview.component";
import {TrailDto, TrailMappingDto, TrailService} from "../../../service/trail-service.service";
import {AuthService} from "../../../service/auth.service";
import {NgbDateStruct, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-maintenance-add',
    templateUrl: './maintenance-add.component.html',
    styleUrls: ['./maintenance-add.component.scss']
})
export class MaintenanceAddComponent implements OnInit {

    formGroup: FormGroup;

    trail: TrailDto;
    markers: Marker[] = [];

    trailMappings: TrailMappingDto[] = [];
    selectedTrails: TrailDto[] = [];
    hasFormBeenInitialized: boolean = false;

    trailIds: string[];
    realm: string;

    date: NgbDateStruct;

    today = moment()
    maxDate: NgbDateStruct = {
        year: this.today.year(),
        month: this.today.month() + 1,
        day: this.today.date()
    };

    constructor(
        private trailPreviewService: TrailPreviewService,
        private maintenanceService: MaintenanceService,
        private authService: AuthService,
        private modalService: NgbModal,
        private trailService: TrailService,
        private router: Router) {
    }

    ngOnInit(): void {
        this.date = {
            year: this.today.year(),
            day: this.today.date(),
            month: this.today.month() + 1
        };
        this.realm = this.authService.getRealm();
        this.trailPreviewService.getMappings(this.realm).subscribe(
            (resp) => {
                this.trailMappings = resp.content;
            });

        this.formGroup = new FormGroup({
            'trailId': new FormControl('', Validators.required),
            'description': new FormControl('', Validators.required),
            'contact': new FormControl('', Validators.required),
            'meetingPlace': new FormControl(''),
            'date': new FormControl('', Validators.required),
        });
    }

    onLoad(x: TrailPreviewResponse) {
        this.trailIds = x.content.map(tp => tp.code);
    }

    onSubmit() {
        if (this.formGroup.valid) {

            let maintenance: MaintenanceDto = this.formGroup.value as MaintenanceDto;
            let formDate = this.formGroup.value.date;
            maintenance.date = moment(formDate.year +
                "-" + formDate.month +
                "-" + formDate.day).toISOString();

            this.maintenanceService.save(maintenance).subscribe(resp => {
                if (resp.status == Status.OK) {
                    this.onSaveSuccess(maintenance)
                }
            });
        } else {
            alert("Alcuni campi sono ancora da completare")
        }
    }

    onSaveSuccess(maintenance: MaintenanceDto) {
        this.router.navigate(['/admin/maintenance-management', {success: maintenance.id}]);
    }

    onSelectedTrail($event: any) {
        const id = $event.target.value;
        this.loadTrail(id);
    }

    private loadTrail(id) {
        this.trailService.getTrailById(id).subscribe(resp =>
            this.trail = resp.content[0]
        );
    }

    onCancel() {
        scroll(0,0);
        this.router.navigate(["/admin/maintenance-management"])
    }
}
