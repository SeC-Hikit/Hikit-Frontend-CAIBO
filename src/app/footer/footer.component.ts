import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
    isVisible = true;

    constructor(private routerService: Router) {
    }


    scrollTop() {
        scroll(0,0);
    }
    ngOnInit(): void {
        this.routerService.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.isVisible = !this.routerService.url.startsWith("/map");
            }
        });

    }

}
