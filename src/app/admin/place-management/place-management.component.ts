import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-place-management',
  templateUrl: './place-management.component.html',
  styleUrls: ['./place-management.component.scss']
})
export class PlaceManagementComponent implements OnInit {

  isAllowed: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getUserProfile().then((resp) => {
      if (resp == 'admin' || resp == 'maintainer' || resp == 'content_creator') {
        this.isAllowed = true;
      }
    });
  }

}
