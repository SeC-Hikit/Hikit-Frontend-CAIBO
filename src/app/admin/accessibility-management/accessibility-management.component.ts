import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-accessibility-management',
  templateUrl: './accessibility-management.component.html',
  styleUrls: ['./accessibility-management.component.scss']
})
export class AccessibilityManagementComponent implements OnInit {

  isAllowed: boolean = false;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.getUserProfile().then((resp) => {
      if (resp == 'admin' || resp == 'maintainer') {
        this.isAllowed = true;
      }
    });
  }


}
