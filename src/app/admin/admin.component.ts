import { Component, OnInit } from '@angular/core';
import {AuthService} from "../service/auth.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  adminName: string = '';
  section : string = '';
  sectionCode : string = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getUsername().then((resp)=> {
      this.adminName = resp;
    })

    this.section = this.authService.getSection().replace("-", " ").toLocaleUpperCase();
    this.sectionCode = this.authService.getSection();
  }

}
