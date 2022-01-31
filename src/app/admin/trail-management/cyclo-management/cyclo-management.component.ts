import {Component, OnInit} from '@angular/core';
import {Form, FormControl, FormGroup} from "@angular/forms";
import {TrailImportFormUtils} from "../../../utils/TrailImportFormUtils";
import {ActivatedRoute} from "@angular/router";
import {TrailService} from "../../../service/trail-service.service";

@Component({
    selector: 'app-cyclo-management',
    templateUrl: './cyclo-management.component.html',
    styleUrls: ['./cyclo-management.component.scss']
})
export class CycloManagementComponent implements OnInit {

    isLoading = false;
    trailFormGroup: FormGroup;

    constructor(private route: ActivatedRoute,
                private trailService: TrailService) {
    }

    ngOnInit(): void {
        this.trailFormGroup = new FormGroup({
            cyclo: TrailImportFormUtils.getCylcloFormGroup()
        });
        const idFromPath: string = this.route.snapshot.paramMap.get("id");
        this.trailService.getTrailById(idFromPath).subscribe((resp)=>{
            if(resp.content.length == 1) {
                // TODO: load this in
            }
        })
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
        return this.cyclo["classification"] as FormControl;
    }
}
