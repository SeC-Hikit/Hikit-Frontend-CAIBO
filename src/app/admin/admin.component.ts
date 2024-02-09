import {Component, OnInit} from '@angular/core';
import {AuthService} from "../service/auth.service";
import {InstanceInfoDto, InstanceService} from "../service/instance.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AdminDiagnoseService, DiagnoseResponse} from "../service/diagnose.service";
import {Profile, ProfileChecker} from "./ProfileChecker";

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

  async ngOnInit() {
    let allowedProfiles: Profile[] = [Profile.admin,
                                      Profile.maintainer,
                                      Profile.contentCreator,
                                      Profile.casualVolunteer];
    this.isAllowed = await ProfileChecker.checkProfile(this.authService, allowedProfiles);
    console.log(this.isAllowed);

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
