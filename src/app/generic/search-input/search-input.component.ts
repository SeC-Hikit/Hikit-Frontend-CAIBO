import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {

  private readonly timeout = 600;

  private value: string = "";
  private interval;

  @Input() placeholder: string;
  @Output() onChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {}

  onSearchKeyPress($event: Event) {
    // @ts-ignore
    this.value = $event.target.value;
    this.ensureEraseTimeOut();
    this.interval = setTimeout(()=> { this.onChange.emit(this.value)}, this.timeout)
  }

  ngOnDestroy(): void {this.ensureEraseTimeOut();}

  private ensureEraseTimeOut() {
    if (this.interval) clearTimeout(this.interval);
  }
}
