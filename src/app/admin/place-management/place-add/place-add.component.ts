import {Component, OnInit} from '@angular/core';
import {Coordinates2D} from "../../../service/geo-trail-service";
import {Marker} from "../../../map-preview/map-preview.component";
import {MapPinIconType} from "../../../../assets/icons/MapPinIconType";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {GeoToolsService} from "../../../service/geotools.service";
import {AdminPlaceService} from "../../../service/admin-place.service";
import {AuthService} from "../../../service/auth.service";
import {environment} from "../../../../environments/environment.prod";
import * as moment from "moment";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-place-add',
  templateUrl: './place-add.component.html',
  styleUrls: ['./place-add.component.scss']
})
export class PlaceAddComponent implements OnInit {

  errors = [];
  markers: Marker[] = [];

  formGroup : FormGroup;

  constructor(private geoToolService: GeoToolsService,
              private placeService: AdminPlaceService,
              private routerService: Router,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      id: new FormControl(""),
      name: new FormControl("", Validators.required),
      tags: new FormControl(""),
      description: new FormControl(""),
      coordLongitude: new FormControl("", Validators.required),
      coordLatitude: new FormControl("", Validators.required),
      coordAltitude: new FormControl("", Validators.required),
    });
  }

  onMapClick(coords: Coordinates2D) {
    this.markers = [{
      icon: MapPinIconType.PIN,
      coords: coords,
      color: "#1D9566"
    }]
    this.geoToolService.getAltitude(coords).subscribe((resp)=> {
      this.formGroup.get("coordLongitude").setValue(resp.longitude);
      this.formGroup.get("coordLatitude").setValue(resp.latitude);
      this.formGroup.get("coordAltitude").setValue(resp.altitude);
    })
  }

  processModule() {
    this.errors = [];
    if(!this.formGroup.valid) {
      this.errors = ["Uno dei campi, contrassegnati da *, non è stato compilato"];
      return false;
    }
    this.authService.getUsername().then((name) => {
      this.placeService.create({
        id: null,
        name: this.formGroup.get("name").value.trim(),
        coordinates: [
          {
            longitude: this.formGroup.get("coordLongitude").value,
            latitude: this.formGroup.get("coordLatitude").value,
            altitude: this.formGroup.get("coordAltitude").value
          }
        ],
        tags: this.formGroup.get("tags").value.split(",").map(a => a.trim()),
        description: this.formGroup.get("description").value.trim(),
        crossingTrailIds: [],
        mediaIds: [],
        recordDetails: {
          uploadedOn: moment().toDate().toISOString(),
          uploadedBy: name,
          realm: this.authService.getRealm(),
          onInstance: environment.instance
        }
      }).subscribe((resp)=> {
        if(resp.messages.length == 0) {
          this.routerService.navigate(["../view"], {
            relativeTo: this.activatedRoute
          })
        }
      })
    });
  }
}
