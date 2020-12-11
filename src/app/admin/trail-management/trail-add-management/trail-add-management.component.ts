import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
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
  uploadFileFormGroup: FormGroup;

  constructor(private importService: ImportService) { }

  ngOnInit(): void {

    this.uploadFileFormGroup = new FormGroup({
      'fileUpload': new FormControl()
    });

    this.trailFormGroup = new FormGroup({
      'code': new FormControl(''),
      'name': new FormControl(''),
      'classification': new FormControl(''),
      'description': new FormControl(''),
      'date': new FormControl(''),
      'maintenanceSection': new FormControl(''),
      'positiveDifferenceHeight': new FormControl(''),
      'negativeDifferenceHeight': new FormControl(''),
      'totalDistance': new FormControl(''),
      'eta': new FormControl(''),
      'start': FormUtils.getLocationFormGroup(),
      'destination': FormUtils.getLocationFormGroup(),
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

  uploadFile(file: File): void {
    this.importService.readTrail(file).subscribe(x => { this.tpm = x; this.populateForm(this.tpm) });
  }

  populateForm(tpm: TrailPreparationModel) {
    this.previewCoords = tpm.coordinates;
    this.trailFormGroup.controls['code'].setValue(tpm.name);
    this.trailFormGroup.controls['description'].setValue(tpm.description);
    // TODO continue to populate stuff
  }

  saveTrail() {

  }

  ngAfterViewInit(): void {

  }

  get places() {
    return this.trailFormGroup.controls['places'] as FormArray;
  }

  get firstPos() {
    return this.trailFormGroup.controls['start'] as FormGroup;
  }

  get finalPos() {
    return this.trailFormGroup.controls['destination'] as FormGroup;
  }

}
