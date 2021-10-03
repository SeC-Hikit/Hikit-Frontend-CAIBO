import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-items-not-found",
  templateUrl: "./items-not-found.component.html",
  styleUrls: ["./items-not-found.component.scss"],
})
export class ItemsNotFoundComponent implements OnInit {
  @Input() text?: string;

  constructor() {}

  ngOnInit(): void {}
}
