import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/service/auth.service";
import {
  TrailPreview,
  TrailPreviewResponse,
  TrailPreviewService,
} from "src/app/service/trail-preview-service.service";
import { IntUtils } from "src/app/utils/IntUtils";
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import { Trail, TrailService } from "src/app/service/trail-service.service";

@Component({
  selector: "app-poi-add",
  templateUrl: "./poi-add.component.html",
  styleUrls: ["./poi-add.component.scss"],
})
export class PoiAddComponent implements OnInit {
  
  isTrailListLoaded = false;
  isTrailLoaded = false;
  
  selectedTrail : Trail;
  trailPreviewResponse: TrailPreviewResponse;


  constructor(
    private trailPreviewService: TrailPreviewService,
    private trailService : TrailService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    const realm = this.authService.getRealm();
    await this.trailPreviewService
      .getPreviews(0, IntUtils.MAX_INT, realm)
      .subscribe((resp) => {
        this.trailPreviewResponse = resp;
        this.selectFirstTrail(resp.content);
        this.isTrailListLoaded = true;
      });
  }

  private selectFirstTrail(trailPreviews: TrailPreview[]) {
    if(trailPreviews.length > 0){
      this.trailService.getTrailByCode(trailPreviews[0].id).subscribe((resp)=>{ 
        this.selectedTrail = resp.content[0];
        this.isTrailLoaded = true;
      });
    }
  }

  onChangeTrail(e) {
    console.log(e);
  }

}
