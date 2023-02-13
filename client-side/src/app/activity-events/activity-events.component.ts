import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators'

import { config } from '../addon.config'
import { EventsService } from '../services/events.service';

@Component({
    selector: 'activity-events',
    templateUrl: './activity-events.component.html',
    styleUrls: ['./activity-events.component.scss']
})
export class ActivityEventsComponent implements OnInit, AfterViewInit {
    @Input() hostObject: any;

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    
    @ViewChild('eventsABI', { read: ViewContainerRef }) eventsContainer: ViewContainerRef;

    eventsBlockPath = '';
    eventsBlockDev = false;
    loaded = false


    constructor(
        private activateRoute: ActivatedRoute,
        private router: Router,
        private eventsService: EventsService,
        ) {
            this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
                this.eventsBlockDev = this.activateRoute.snapshot.queryParams.events_dev === "true" || false;
                if(this.eventsBlockDev) {
                    this.eventsBlockPath = 'http://localhost:4600/file_cbbc42ca-0f20-4ac8-b4c6-8f87ba7c16ad.js';
                }
            });
    }

    ngOnInit(): void {
        const atdUUID = this.hostObject.objectList[0];
        this.eventsService.getTransactionEvents(atdUUID).then(events => {
            this.hostObject = {
                ...this.hostObject,
                AddonUUID: config.AddonUUID,
                PossibleEvents: events,
                Name: atdUUID
            }
            this.loaded = true;
        });
    }

    ngOnChanges(e: any): void {

    }

    ngAfterViewInit() {
    }
}
