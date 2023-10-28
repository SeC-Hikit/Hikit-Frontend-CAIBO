import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-search-input',
    templateUrl: './search-input.component.html',
    styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {

    private readonly timeout = 100;

    private value: string = "";
    private interval;

    @Input() id: string = "search-box";
    @Input() placeholder: string;
    @Output() onTypingChange = new EventEmitter<string>();
    @Output() onEnterPress = new EventEmitter<string>();

    constructor() {
    }

    ngOnInit(): void {
    }

    onTyping($event: KeyboardEvent) {
        // @ts-ignore
        this.value = $event.target.value;
        this.ensureEraseTimeOut();
        this.interval = setTimeout(() => {
            this.onTypingChange.emit(this.value)
        }, this.timeout)
    }

    ngOnDestroy(): void {
        this.ensureEraseTimeOut();
    }

    private ensureEraseTimeOut() {
        if (this.interval) clearTimeout(this.interval);
    }

    onSearchKeyPress($event: Event) {
        // @ts-ignore
        const value = $event.target.value;
        this.onEnterPress.emit(value);
    }
}
