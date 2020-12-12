import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImportService } from 'src/app/import.service';
import { TrailCoordinates } from 'src/app/TrailCoordinates';
import { TrailPreparationModel } from 'src/app/TrailPreparationModel';
import { FormUtils } from 'src/app/utils/FormUtils';
@Component({
  selector: 'app-trail-add-management',
  templateUrl: './trail-add-management.component.html',
  styleUrls: ['./trail-add-management.component.css']
})
export class TrailAddManagementComponent implements OnInit {

  tpm: TrailPreparationModel;
  previewCoords: TrailCoordinates[];
  trailFormGroup: FormGroup;
  uploadedSuccesfull: boolean = false; 

  constructor(private importService: ImportService, private router: Router) { }

  ngOnInit(): void {

    this.trailFormGroup = new FormGroup({
      'code': new FormControl('', Validators.required),
      'name': new FormControl(''),
      'classification': new FormControl('', Validators.required),
      'description': new FormControl('', Validators.required),
      'date': new FormControl('', Validators.required),
      'maintenanceSection': new FormControl('', Validators.required),
      'startPos': FormUtils.getLocationFormGroup(),
      'finalPos': FormUtils.getLocationFormGroup(),
      'places': new FormArray([])
    })
  }

  onUploadGpx(files: FileList): void {
    let fileToUpload = files.item(0);
    this.uploadFile(fileToUpload);
  }

  onAddLocation(): void {
    this.places.push(FormUtils.getLocationFormGroup())
  }

  onReload(): void {
    this.uploadedSuccesfull = false;
  }

  uploadFile(file: File): void {
    this.importService.readTrail(file).subscribe(x => { this.tpm = x; this.populateForm(this.tpm); this.uploadedSuccesfull = true; });
  }

  populateForm(tpm: TrailPreparationModel) {
    this.previewCoords = tpm.coordinates;
    this.trailFormGroup.controls['code'].setValue(tpm.name);
    this.trailFormGroup.controls['description'].setValue(tpm.description);
    this.firstPos.controls['name'].setValue(tpm.startPos.name);
    this.firstPos.controls['latitude'].setValue(tpm.startPos.coordinates.latitude);
    this.firstPos.controls['longitude'].setValue(tpm.startPos.coordinates.longitude);
    this.firstPos.controls['altitude'].setValue(tpm.startPos.coordinates.altitude);
    this.firstPos.controls['distanceFromTrailStart'].setValue(tpm.startPos.coordinates.distanceFromTrailStart);
    this.finalPos.controls['name'].setValue(tpm.finalPos.name);
    this.finalPos.controls['latitude'].setValue(tpm.finalPos.coordinates.latitude);
    this.finalPos.controls['longitude'].setValue(tpm.finalPos.coordinates.longitude);
    this.finalPos.controls['altitude'].setValue(tpm.finalPos.coordinates.altitude);
    this.finalPos.controls['distanceFromTrailStart'].setValue(tpm.finalPos.coordinates.distanceFromTrailStart);
  }

  saveTrail() {
    if(this.trailFormGroup.valid){
      console.log("Valid!");
    }
    console.info(this.trailFormGroup.value);
    // TODO: GO AHEAD and save it
    
  }

  ngAfterViewInit(): void {

  }

  get places() {
    return this.trailFormGroup.controls['places'] as FormArray;
  }

  get firstPos() {
    return this.trailFormGroup.controls['startPos'] as FormGroup;
  }

  get finalPos() {
    return this.trailFormGroup.controls['finalPos'] as FormGroup;
  }

}
