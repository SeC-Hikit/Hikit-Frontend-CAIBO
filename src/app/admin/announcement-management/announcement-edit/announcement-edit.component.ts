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
        {name: "Avviso", value: "WARNING"},
        {name: "Emergenza", value: "EMERGENCY"},
    ];
    formGroup: FormGroup = new FormGroup({
        id: new FormControl(""),
        name: new FormControl("", Validators.required),
        description: new FormArray([]),
        relatedTopic: new FormControl("TRAIL"),
        relatedTopicId: new FormControl(""),
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
    isRelatedTopicValid: boolean = false;

    constructor(private announcementService: AnnouncementService,
                private activatedRoute: ActivatedRoute,) {
    }

    ngOnInit(): void {
        this.hasFormBeenInitialized = true;
        const idFromPath: string = this.activatedRoute.snapshot.paramMap.get("id");

        // related topic from load
        const relatedTopic: string = this.activatedRoute.snapshot.paramMap.get("relatedTopic");
        const relatedTopicId: string = this.activatedRoute.snapshot.paramMap.get("relatedTopicId");

        if(relatedTopic && relatedTopicId) {
            this.formGroup.get("relatedTopic").setValue(relatedTopic);
            this.formGroup.get("relatedTopicId").setValue(relatedTopicId);
        }

        if(idFromPath != null) {
            this.loadAnnouncement(idFromPath)
            this.isRelatedTopicValid = true;
        }
    }

    private loadAnnouncement(idFromPath: string) {
        // TODO
    }

    processModule() {

    }

    getEntity() {

    }

    setElement($event: Event) {

    }
}
