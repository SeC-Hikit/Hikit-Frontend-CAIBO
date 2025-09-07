import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Media, MediaResponse, MediaService} from "../../service/media-service.service";
import {ImportService} from "../../service/import.service";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import {InfoModalComponent} from "../../modal/info-modal/info-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PaginationUtils} from "../../utils/PaginationUtils";

@Component({
  selector: 'app-media-management',
  templateUrl: './media-management.component.html',
  styleUrls: ['./media-management.component.scss']
})
export class MediaManagementComponent implements OnInit {
  isLoading: boolean = false;

  private destroy$ = new Subject();

  public page: number;
  public entryPerPage = 10;
  public medias: Media[] = [];
  public totalMedia: number;
  public realm: string;

  constructor(public authService: AuthService,
              public mediaService: MediaService,
              public importService: ImportService,
              private modalService: NgbModal) {

  }

  ngOnInit(): void {
      this.realm = this.authService.getUserRealm();
      this.mediaService.get(0, this.entryPerPage,
          this.realm).subscribe((it) => {
          this.medias = it.content;
          this.totalMedia = it.totalCount
          this.page = it.currentPage
      })

  }

  uploadFile(file: FileList) {
    this.isLoading = true;
    console.log(file);
    this.importService
        .uploadImage(file[0])
        .pipe(takeUntil(this.destroy$))
        .subscribe((response: MediaResponse) => {
          this.isLoading = false;
            let uploadedFile = response.content[0];
            if (response.status == 'ERROR') {
            this.modalOpen("Error con upload dei .gpx",
                "Errore con l'upload dei file(s): " + response.messages);
            return;

          } else {
              this.modalOpen("Immagine caricata con successo",
                  `Caricamento completato <br>
                   <div class='col-12'>
                    <div class="img-preview">
                    <img src='${uploadedFile.fileUrl + "." + uploadedFile.extension}'/>
                   </div>
                </div>`)
          }
          console.log(uploadedFile.id);
        });
  }

    private modalOpen(title: string, body: string) {
        this.isLoading = false;
        const modal = this.modalService.open(InfoModalComponent, {scrollable : true});
        modal.componentInstance.title = title;
        modal.componentInstance.body = body;
    }

    openPreview(media: Media) {
        this.isLoading = true;
        const id = media.id;
        const elected = this.medias.filter(it => it.id == id)[0]
        this.modalOpen(`Anteprima di ${elected.name}: `,
            `<div class='col-12'>
                    <div class="img-preview">
                    <img src='${elected.fileUrl + "_l" + "." + elected.extension}' width='300'/>
                   </div>
                </div>`)
    }

    delete(id: string) {
        
    }

    loadPage(page: number) {
        PaginationUtils.up();
        this.page = page;
        this.mediaService.get(
            PaginationUtils.getLowerBound(page, this.entryPerPage),
            PaginationUtils.getUpperBound(page, this.entryPerPage),
            this.realm).subscribe(resp => {
                this.medias = resp.content;
                this.totalMedia = resp.totalCount
                this.page = resp.currentPage
            });
    }

    onSelect() {
    }
}
