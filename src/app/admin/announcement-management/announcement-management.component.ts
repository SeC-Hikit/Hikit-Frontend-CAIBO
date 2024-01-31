import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-announcement-management',
  templateUrl: './announcement-management.component.html',
  styleUrls: ['./announcement-management.component.scss']
})
export class AnnouncementManagementComponent implements OnInit {

  isAllowed: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getUserProfile().then((resp) => {
      if (resp == 'admin' || resp == 'maintainer' || resp == 'casual_volunteer') {
        this.isAllowed = true;
      }
    })
  }

}
