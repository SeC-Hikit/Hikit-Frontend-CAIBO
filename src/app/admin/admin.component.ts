import {Component, OnInit} from '@angular/core';
import {AuthService} from "../service/auth.service";
import {InstanceInfoDto, InstanceService} from "../service/instance.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AdminDiagnoseService, DiagnoseResponse} from "../service/diagnose.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  isAllowed: boolean = false;

  isLoading: boolean = false;
  userName: string = '';
  userRealm: string = '';
  userSection : string = '';
  userSectionCode: string = '';
  diagnoseAltitudeResponse: DiagnoseResponse = null;

  instanceInfo : InstanceInfoDto;

  constructor(private authService: AuthService,
              private instanceService: InstanceService,
              private diagnoseService: AdminDiagnoseService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.authService.getUserProfile().then((resp) => {
      if (resp == 'admin') {
        this.isAllowed = true;
      }
    });

    this.authService.getUsername().then((resp)=> {
      this.userName = resp;
    })

    this.instanceService.get().subscribe((resp) => {
      this.instanceInfo = resp;
    })

    this.userRealm = this.authService.getUserRealm();

    this.userSection = this.authService.getSection().replace("-", " ").toLocaleUpperCase();
    this.userSectionCode = this.authService.getSection();
  }

  onDiagnoseAltitudeClick() {
    this.isLoading = true;
    this.diagnoseService.testAltitude()
        .subscribe((resp) => {
          this.isLoading = false;
          this.diagnoseAltitudeResponse = resp;
        })
  }
}
