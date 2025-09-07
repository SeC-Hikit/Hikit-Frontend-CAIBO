import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Media} from "../../../service/media-service.service";
import {AuthService} from "../../../service/auth.service";

@Component({
  selector: 'app-media-table',
  templateUrl: './media-table.component.html',
  styleUrls: ['./media-table.component.scss']
})
export class MediaTableComponent implements OnInit {

  @Input() public medias: Media[] = [];

  @Output() public onSelectClick : EventEmitter<Media> = new EventEmitter<Media>();
  @Output() public onPreviewClick : EventEmitter<Media> = new EventEmitter<Media>();
  @Output() public onDeleteClick : EventEmitter<Media> = new EventEmitter<Media>();
  @Input() isDeletedEnabled: boolean = false;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

}
