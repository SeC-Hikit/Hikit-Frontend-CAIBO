import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {AnnouncementService} from "../../../service/announcement.service";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-announcement-edit',
    templateUrl: './announcement-edit.component.html',
    styleUrls: ['./announcement-edit.component.scss']
})
export class AnnouncementEditComponent implements OnInit {
    isModify: boolean;
    announcementTypes = [
        {name: "Evento", value: "EVENT"},
        {name: "Informazione", value: "INFO"},
        {name: "Avvertimento", value: "WARNING"},
        {name: "Emergenza", value: "EMERGENCY"},
    ];
    formGroup: FormGroup = new FormGroup({
        id: new FormControl(""),
        name: new FormControl("", Validators.required),
        description: new FormArray([]),
        relatedTopic: new FormControl("TRAIL"),
        relatedId: new FormControl(""),
        type: new FormControl(this.announcementTypes[0].value),
        valid: new FormControl(true)
    });
    hasFormBeenInitialized: boolean = false;

    relatedElementTypes = [
        {name: "Sentiero", value: "TRAIL"},
        {name: "Punto d'interesse", value: "POI"},
        {name: "Località/Crocevia", value: "PLACE"},
        {name: "Avviso di percorribilità", value: "ACCESSIBILITY_NOTIFICATION"},
        {name: "Manutenzione", value: "MAINTENANCE"},
    ];

    validationErrors: string[] = [];

    constructor(private announcementService: AnnouncementService,
                private activatedRoute: ActivatedRoute,) {
    }

    ngOnInit(): void {
        this.hasFormBeenInitialized = true;
        const idFromPath: string = this.activatedRoute.snapshot.paramMap.get("id");

        if(idFromPath != null) {
            this.loadAnnouncement(idFromPath)
        }
    }

    private loadAnnouncement(idFromPath: string) {
        // TODO
    }

    processModule() {

    }
}
