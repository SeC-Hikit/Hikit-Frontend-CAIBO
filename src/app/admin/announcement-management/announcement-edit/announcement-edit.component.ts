import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {AnnouncementDto, AnnouncementService} from "../../../service/announcement.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AdminAnnouncementService} from "../../../service/admin-announcement.service";
import * as moment from "moment/moment";
import {environment} from "../../../../environments/environment.prod";
import {AuthService} from "../../../service/auth.service";

@Component({
    selector: 'app-announcement-edit',
    templateUrl: './announcement-edit.component.html',
    styleUrls: ['./announcement-edit.component.scss']
})
export class AnnouncementEditComponent implements OnInit {
    isModify: boolean = false;
    announcementTypes = AnnouncementService.announcementTypes;
    formGroup: FormGroup = new FormGroup({
        id: new FormControl(""),
        name: new FormControl("", Validators.required),
        description: new FormControl([]),
        relatedTopic: new FormControl("TRAIL"),
        relatedTopicId: new FormControl(""),
        type: new FormControl(AnnouncementService.announcementTypes[0].value),
        valid: new FormControl(true)
    });

    hasFormBeenInitialized: boolean = false;

    relatedElementTypes = AnnouncementService.relatedElementTypes;

    validationErrors: string[] = [];
    isRelatedTopicValid: boolean = false;

    constructor(private announcementService: AnnouncementService,
                private adminAnnouncementService: AdminAnnouncementService,
                private activatedRoute: ActivatedRoute,
                private routerService: Router,
                private authService: AuthService) {
    }

    ngOnInit(): void {
        this.hasFormBeenInitialized = true;
        const idFromPath: string = this.activatedRoute.snapshot.paramMap.get("id");

        // related topic from load
        const relatedTopic: string = this.activatedRoute.snapshot.paramMap.get("relatedTopic");
        const relatedTopicId: string = this.activatedRoute.snapshot.paramMap.get("relatedTopicId");

        if (relatedTopic && relatedTopicId) {
            this.formGroup.get("relatedTopic").setValue(relatedTopic);
            this.formGroup.get("relatedTopicId").setValue(relatedTopicId);
        }

        if (idFromPath != null) {
            this.isModify = true;
            this.loadAnnouncement(idFromPath)
            this.isRelatedTopicValid = true;
        }
    }

    private loadAnnouncement(idFromPath: string) {

        this.announcementService.getAnnouncementById(idFromPath).subscribe((it)=> {
            const element = it.content[0];
            this.formGroup = new FormGroup({
                id: new FormControl(element.id),
                name: new FormControl(element.name, Validators.required),
                description: new FormControl(element.description),
                relatedTopic: new FormControl(element.relatedTopic.announcementTopicType),
                relatedTopicId: new FormControl(element.relatedTopic.id),
                type: new FormControl(element.type),
                valid: new FormControl(element.valid)
            });
        })


    }

    processModule() {
        if (!this.formGroup.valid) {
            this.validationErrors = ["Alcuni campi non sono compilati correttamente"];
            return;
        }

        this.authService.getUsername().then((name) => {

            const announcementDto: AnnouncementDto = {
                id: this.formGroup.get("id").value,
                type: this.formGroup.get("type").value,
                name: this.formGroup.get("name").value,
                relatedTopic: {
                    announcementTopicType: this.formGroup.get("relatedTopic").value,
                    id: this.formGroup.get("relatedTopicId").value
                },
                description: this.formGroup.get("description").value,
                valid: this.formGroup.get("valid").value,
                recordDetails: {
                    uploadedOn: moment().toDate().toISOString(),
                    uploadedBy: name,
                    realm: this.authService.getUserRealm(),
                    onInstance: environment.instance
                }
            }

            if(this.isModify){
                this.onModify(announcementDto);
                return;
            }
            this.onCreate(announcementDto);

        })
    }

    private onCreate(announcementDto: AnnouncementDto) {
        this.adminAnnouncementService.create(announcementDto).subscribe((it) => {
            if (it.status == "OK") {
                this.routerService.navigate(["/admin/announcement-management"]);
                scroll(0, 0)
            }
        })
    }

    private onModify(announcementDto: AnnouncementDto) {
        this.adminAnnouncementService.update(announcementDto).subscribe((it) => {
            if (it.status == "OK") {
                this.routerService.navigate(["/admin/announcement-management"]);
                scroll(0, 0)
            }
        })
    }
}
