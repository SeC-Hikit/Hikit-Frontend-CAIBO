import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {TrailImportFormUtils} from "../../../utils/TrailImportFormUtils";
import {ActivatedRoute, Router} from "@angular/router";
import {CycloDetailsDto, TrailDto, TrailResponse, TrailService} from "../../../service/trail-service.service";
import {AdminTrailService} from "../../../service/admin-trail.service";
import {Status} from "../../../Status";

@Component({
    selector: 'app-cyclo-management',
    templateUrl: './cyclo-management.component.html',
    styleUrls: ['./cyclo-management.component.scss']
})
export class CycloManagementComponent implements OnInit {

    isLoading = true;
    trailFormGroup: FormGroup;

    trailDto: TrailDto;
    isPreviewVisible: boolean = false;

    constructor(private route: ActivatedRoute,
                private trailService: TrailService,
                private trailAdminService: AdminTrailService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.trailFormGroup = new FormGroup({
            cyclo: TrailImportFormUtils.getCycloFormGroup()
        });
        const idFromPath: string = this.route.snapshot.paramMap.get("id");
        this.trailService.getTrailById(idFromPath).subscribe((resp) => {
            if (resp.content.length == 0) {
                alert("")
            }
            let trail = resp.content[0];
            this.trailDto = trail;
            this.loadData(trail)
            this.isLoading = false;
        })
    }

    loadData(trailDto: TrailDto): void {
        let cycloControl = this.trailFormGroup.get("cyclo");
        let wayBack = cycloControl.get("wayBack");
        let wayForward = cycloControl.get("wayForward");
        cycloControl.get("classification").setValue(trailDto.cycloDetails.cycloClassification);
        wayBack.get("feasible").setValue(trailDto.cycloDetails.wayBack.feasible);
        wayBack.get("portage").setValue(trailDto.cycloDetails.wayBack.portage);
        wayForward.get("feasible").setValue(trailDto.cycloDetails.wayForward.feasible);
        wayForward.get("portage").setValue(trailDto.cycloDetails.wayForward.portage);
        cycloControl.get("description").setValue(trailDto.cycloDetails.description);
        cycloControl.get("officialEta").setValue(trailDto.cycloDetails.officialEta);
    }

    save() {
        let trail = this.trailDto;

        let cycloControl = this.cyclo;
        let wayBack = this.wayBack;
        let wayForward = this.wayForward;
        let officialEta = this.officialEta;

        this.trailDto.cycloDetails = {
            wayBack: {
                portage: wayBack.get("portage").value,
                feasible: wayBack.get("feasible").value
            },
            wayForward: {
                portage: wayForward.get("portage").value,
                feasible: wayForward.get("feasible").value
            },
            cycloClassification: cycloControl.get("classification").value,
            description: cycloControl.get("description").value,
            officialEta: officialEta.value,
        };

        this.trailAdminService.updateTrail(this.trailDto).subscribe(it => {
            if (it.content.length > 0) {
                this.ensureStatusOkNavigation(it.content[0]);
            }
        });
    }

    private ensureStatusOkNavigation(it: TrailDto) {
        this.router.navigate([
            "admin/trail-management",
            {
                success: it.code
            },
        ]);
    }

    togglePreview() {
        this.isPreviewVisible = !this.isPreviewVisible;
    }

    get wayForward() {
        return this.cyclo.controls["wayForward"] as FormGroup;
    }

    get wayBack() {
        return this.cyclo.controls["wayBack"] as FormGroup;
    }

    get cyclo() {
        return this.trailFormGroup.controls["cyclo"] as FormGroup;
    }

    get cyclo_classification() {
        return this.cyclo.get("classification") as FormControl;
    }

    get officialEta() {
        return this.cyclo.get("officialEta") as FormControl;
    }
}
