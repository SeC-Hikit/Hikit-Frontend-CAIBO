import { Component, OnInit } from '@angular/core';
import { Trail } from '../Trail';

@Component({
  selector: 'app-map-trail-details',
  templateUrl: './map-trail-details.component.html',
  styleUrls: ['./map-trail-details.component.css']
})
export class MapTrailDetailsComponent implements OnInit {

  notificationsForTrail : Notification[];
  selectedTrail: Trail;

  constructor() { }

  ngOnInit(): void {
    
  }

  

}
