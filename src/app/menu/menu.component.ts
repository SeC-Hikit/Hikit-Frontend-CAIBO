import {Component, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';


@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

    publicName = ""
    isMobileMenuShowing: boolean = false;

    constructor() {

    }

    ngOnInit(): void {
        this.publicName = environment.publicName;
    }

    toggleMenu() {
        this.isMobileMenuShowing = !this.isMobileMenuShowing;
        this.toggleScrolling();
    }

    private toggleScrolling() {
        if (this.isMobileMenuShowing) {
            window.onscroll = function () {
                window.scrollTo(0, 0);
            };
        } else {
            window.onscroll = function () {
            };
        }
    }
}
