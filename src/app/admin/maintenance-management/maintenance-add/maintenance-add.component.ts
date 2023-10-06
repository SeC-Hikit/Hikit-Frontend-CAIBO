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
import {NgbDateStruct, NgbModal, NgbTimeStruct} from "@ng-bootstrap/ng-bootstrap";
import {environment} from "../../../../environments/environment.prod";
import {AdminMaintenanceService} from "../../../service/admin-maintenance.service";
import {InfoModalComponent} from "../../../modal/info-modal/info-modal.component";

@Component({
    selector: 'app-maintenance-add',
    templateUrl: './maintenance-add.component.html',
    styleUrls: ['./maintenance-add.component.scss']
})
export class MaintenanceAddComponent implements OnInit {

    formGroup: FormGroup = new FormGroup({
        'trailId': new FormControl(''),
        'trailCode': new FormControl(''),
        'time': new FormControl('', Validators.required),
        'description': new FormControl(''),
        'contact': new FormControl('', Validators.required),
        'meetingPlace': new FormControl('', Validators.required),
        'date': new FormControl('', Validators.required),
    });

    trail: TrailDto;
    markers: Marker[] = [];

    trailMappings: TrailMappingDto[] = [];
    selectedTrails: TrailDto[] = [];
    isLoading: boolean = false;

    trailIds: string[];
    realm: string;


    today = moment()
    date: NgbDateStruct = {
        year: this.today.year(),
        day: this.today.date() + 1,
        month: this.today.month() + 1
    };
    time: NgbTimeStruct = {
        hour: 12,
        minute: 0,
        second: 0
    }
    minDate: NgbDateStruct = {
        year: this.today.year(),
        month: this.today.month() + 1,
        day: this.today.date()
    };

    validationErrors: string[] = [];

    constructor(
        private trailPreviewService: TrailPreviewService,
        private maintenanceService: MaintenanceService,
        private adminMaintenanceService: AdminMaintenanceService,
        private authService: AuthService,
        private modalService: NgbModal,
        private trailService: TrailService,
        private router: Router) {
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.realm = this.authService.getInstanceRealm();
        this.trailPreviewService.getMappings(this.realm).subscribe(
            (resp) => {
                this.trailMappings = resp.content;
                this.isLoading = false;
            });

    }

    onLoad(x: TrailPreviewResponse) {
        this.trailIds = x.content.map(tp => tp.code);
    }

    onSubmit() {
        const formGroup = this.formGroup;
        if (formGroup.valid) {
            this.isLoading = true;
            const maintenance: MaintenanceDto = {
                date: "",
                contact: formGroup.get("contact").value,
                description: formGroup.get("description").value,
                meetingPlace: formGroup.get("meetingPlace").value,
                trailId: formGroup.get("trailId").value,
                trailCode: formGroup.get("trailCode").value,
                id: null,
                recordDetails: {
                    uploadedOn: moment().toDate().toISOString(),
                    uploadedBy: name,
                    realm: this.authService.getUserRealm(),
                    onInstance: environment.instance
                }
            };
            const formDate = formGroup.value.date;
            const formTime = formGroup.value.time;


            const dateTime = moment(formDate.year +
                "-" + formDate.month +
                "-" + formDate.day);
            dateTime.set("minute", formTime.minute);
            dateTime.set("hour", formTime.hour);
            maintenance.date = dateTime.toISOString();

            this.adminMaintenanceService.save(maintenance)
                .subscribe(resp => {
                    if (resp.status == Status.OK) {
                        this.onSaveSuccess(maintenance)
                    } else {
                        this.openModalToShowErrors(resp.messages);
                    }
                    this.isLoading = false;
                });
        } else {
            this.validationErrors = ["Alcuni campi sono vuoti/incompleti"]
        }
    }

    private openModalToShowErrors(errors: string[]) {
        const modal = this.modalService.open(InfoModalComponent);
        modal.componentInstance.title = `Errore nel caricamento del sentiero`;
        const matchingTrail = errors.map(it => `<div>${it}</div>`).join("<br/>");
        modal.componentInstance.body = `Errori imprevista in risposta dal server: ${matchingTrail}`;
    }


    onSaveSuccess(maintenance: MaintenanceDto) {
        scroll(0, 0);
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
        scroll(0, 0);
        this.router.navigate(["/admin/maintenance-management"])
        return false;
    }
}
