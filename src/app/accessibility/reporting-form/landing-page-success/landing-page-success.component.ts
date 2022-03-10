import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AccessibilityNotification, NotificationService} from "../../../service/notification-service.service";
import {ReportService} from "../../../service/report-service.service";

@Component({
    selector: 'app-landing-page-success',
    templateUrl: './landing-page-success.component.html',
    styleUrls: ['./landing-page-success.component.scss']
})
export class LandingPageSuccessComponent implements OnInit {

    private readonly ACTIVATION_PARAM = "activation";

    isActivation = false;
    isActivationValid = false;

    constructor(private reportService: ReportService,
                private routerService: Router,
                private activatedRouterService: ActivatedRoute) {
    }



    ngOnInit(): void {
        this.activatedRouterService.queryParamMap.subscribe((params) => {
            if (params.has(this.ACTIVATION_PARAM)) {
                this.isActivation = true;
                const activation = params.get(this.ACTIVATION_PARAM);

                this.reportService.activate(activation).subscribe(response => {
                    if(response.status == "OK") {
                        this.isActivationValid = true;
                    }
                })

            }
        });
    }

}
