import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {InfoModalComponent} from "../modal/info-modal/info-modal.component";


export class UserFriendlyInputs {

    static showCustomInstructionModalConditionally(modalService: NgbModal) {
        if(localStorage.getItem("customItineraryInstructions_v1")) {
           return;
        }
        const modal = modalService.open(InfoModalComponent);
        modal.componentInstance.title = "Disegno percorso personalizzato 1/2";
        modal.componentInstance.body = "" +
            "<div class='full-width'>" +
            "<img src=\"assets/cai/trekking/custom_itinerary-min.jpg\" alt=\"draw-itinerary\" class='half-width'/></div>" +
            "<div>Grazie a questa nuova funzione, <b>che verrà via via migliorata</b>, è possibile" +
            "<b> disegnare un percorso, calcolarne la lunghezza, altitudini, rilevare problemi di percorrenza e sentieri incontrati.</b><br><br>" +
            "È inoltre possibile <b>scaricare la traccia .gpx</b> da poter portare con sè.</div>";
        modal.componentInstance.onOk.subscribe(() => {
            setTimeout(()=> {
                const modal2 = modalService.open(InfoModalComponent);
                modal2.componentInstance.title = "Disegno percorso personalizzato 2/2";
                modal2.componentInstance.body = "" +
                    "<div class='full-width'><img src=\"assets/cai/trekking/custom_itinerary-min.jpg\" alt=\"draw-itinerary\" class='half-width'/></div>" +
                    "<div>Per iniziare, fai <b>doppio click/tap</b> sulla mappa per inserire punti di attraversamento, poi <b>premi il pulsante calcola '⚡️'</b> per avviare il calcolo del percorso.</div>" +
                    "<div><b>Maggiore sarà la frequenza di punti di attraversamento</b>, <b>maggiore sarà la precisione</b> del percorso calcolato.</div><br>" +
                    "<div>Mentre si disegna, è ancora possibile selezionare altri sentieri, POI, criticità... con il <b>tasto destro/lungo tap</b>.</div>";
                modal2.componentInstance.onOk.subscribe(() => {
                    localStorage.setItem("customItineraryInstructions_v1", "true");
                })
            }, 400)
        })
    }

}
