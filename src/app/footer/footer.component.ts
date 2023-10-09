import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ConfirmModalComponent} from "../modal/confirm-modal/confirm-modal.component";
import posthog from 'posthog-js'

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
    isVisible = true;
    allowCookies = false;

    constructor(private routerService: Router,
                private modalService: NgbModal) {
    }

    scrollTop() {
        scroll(0, 0);
    }

    ngOnInit(): void {
        this.routerService.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.isVisible = !this.routerService.url.startsWith("/map");
            }
        });

        if (!localStorage.getItem("cookiesAcceptance")) {
            const modal = this.modalService.open(ConfirmModalComponent, {
                backdrop: "static"
            });
            modal.componentInstance.title = `Utilizzo dei cookies`;
            modal.componentInstance.body =
                "Noi e terze parti selezionate utilizziamo cookie o tecnologie simili per finalità tecniche e, " +
                "con il tuo consenso, anche per le finalità di funzionalità, esperienza, " +
                "misurazione.<br>" +
                "Puoi liberamente prestare, rifiutare o revocare il tuo consenso, in qualsiasi momento, alla pagina Privacy Policy." +
                "<br>" + "Usa il pulsante “Accetta” per acconsentire. " +
                "<br> Usa il pulsante “Rifiuta” per continuare senza accettare.";
            modal.componentInstance.okBtn = "Accetta";
            modal.componentInstance.cancelBtn = "Rifiuta";

            modal.componentInstance.onCancel.subscribe(() => {
                this.allowCookies = false;
                localStorage.setItem("cookiesAcceptance",
                    this.allowCookies.toString());
                this.checkForCookieAcceptance();
                modal.close();
            })
            modal.componentInstance.onOk.subscribe(() => {
                this.allowCookies = true;
                localStorage.setItem("cookiesAcceptance",
                    this.allowCookies.toString());
                this.checkForCookieAcceptance();
                modal.close();
            });
        }
        this.checkForCookieAcceptance();
    }

    private checkForCookieAcceptance() {
        if (localStorage.getItem("cookiesAcceptance")) {
            this.processCookieDecision();
        }
    }

    private processCookieDecision() {
        this.allowCookies = localStorage.getItem("cookiesAcceptance") == "true";
        if (this.allowCookies) {
            posthog.init('phc_PfvrrOR3xycBfXSNGIk00OfzT74zXF9mfohC4mDkG94',
                {api_host: 'https://eu.posthog.com', autocapture: true,
                capture_pageview: true, disable_session_recording: true});
            posthog.capture('$pageview')
        }
    }
}
