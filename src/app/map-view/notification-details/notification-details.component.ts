import {Component, Input, OnInit} from '@angular/core';
import {TrailMappingDto} from "../../service/trail-service.service";
import {AccessibilityNotification} from "../../service/notification-service.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {InfoModalComponent} from "../../modal/info-modal/info-modal.component";

@Component({
  selector: 'app-notification-details',
  templateUrl: './notification-details.component.html',
  styleUrls: ['./notification-details.component.scss']
})
export class NotificationDetailsComponent implements OnInit {

  @Input() selectedNotification: AccessibilityNotification;
  @Input() trailMappings: Map<string, TrailMappingDto>;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  getImage(description: string) {
    const baseFolder = "assets/cai/poi/";

    if(description.toLowerCase().indexOf("frana") > -1) {
      return baseFolder + "frana-min.webp";
    }
    return baseFolder + "vegetazione-invadente-min.webp";
  }

  showInfoBasedOnMagnitude() {
    const modal = this.modalService.open(InfoModalComponent);
    modal.componentInstance.title = "Info su problemi di percorrenza";
    modal.componentInstance.body = this.getDescription(this.selectedNotification.minor);
  }

  private getDescription(minor: boolean) {
    if(minor) return "Il problema di percorrenza è segnato come 'aggirabile'. <br/> Ciò significa che si tratta " +
        "di un elemento di attenzione non bloccante e di bassa entità. <br/>" +
        "È comunque necessario prestare attenzione al sentiero, e attenersi al buonsenso."
    return "Il problema di percorrenza è segnato come 'non aggirabile'. <br/> Ciò significa che si " +
        "tratta di un elemento di attenzione possibilmente bloccante e/o di grave entità, " +
        "che potrebbe rendere difficile o potenzialmente pericoloso l'attraversamento del sentiero.</br>" +
        "Prestare dunque attenzione durante la percorrenza."
  }
}
