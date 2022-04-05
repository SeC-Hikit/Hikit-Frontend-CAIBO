import { Component, OnInit } from '@angular/core';
import {AuthService} from "../service/auth.service";
import {InstanceInfoDto, InstanceService} from "../service/instance.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  userName: string = '';
  userRealm: string = '';
  userSection : string = '';
  userSectionCode : string = '';

  instanceInfo : InstanceInfoDto;

  constructor(private authService: AuthService,
              private instanceService: InstanceService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.authService.getUsername().then((resp)=> {
      this.userName = resp;
    })

    this.instanceService.get().subscribe((resp)=> {
      this.instanceInfo = resp;
    })

    this.userRealm = this.authService.getUserRealm();

    this.userSection = this.authService.getSection().replace("-", " ").toLocaleUpperCase();
    this.userSectionCode = this.authService.getSection();
  }

}
