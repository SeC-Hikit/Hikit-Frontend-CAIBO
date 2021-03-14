import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-upload-button-management",
  templateUrl: "./upload-button-management.component.html",
  styleUrls: ["./upload-button-management.component.scss"],
})
export class UploadButtonManagementComponent implements OnInit {
  @Input() isMultipleUpload: boolean;

  @Output() uploadedFiles: EventEmitter<FileList> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onUploadGpx(files: FileList): void {
    console.log(files);
    this.uploadedFiles.emit(files);
  }
}
