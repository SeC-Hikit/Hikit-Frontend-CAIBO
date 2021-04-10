import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-upload-button-management",
  templateUrl: "./upload-button-management.component.html",
  styleUrls: ["./upload-button-management.component.scss"],
})
export class UploadButtonManagementComponent implements OnInit {
  @Input() isMultipleUpload: boolean;
  @Input() isDisabled: boolean;

  @Output() uploadedFiles: EventEmitter<FileList> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onUploadGpx(files: FileList): void {
    this.uploadedFiles.emit(files);
  }
}
