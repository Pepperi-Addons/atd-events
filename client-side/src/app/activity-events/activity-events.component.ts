import { TranslateService } from '@ngx-translate/core';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators'

import { config } from '../addon.config'

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
        private translate: TranslateService,
        private addonBlockLoaderService: PepAddonBlockLoaderService,
        private activateRoute: ActivatedRoute,
        private router: Router,
        ) {
            this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
                this.eventsBlockDev = this.activateRoute.snapshot.queryParams.events_dev === "true" || false;
                if(this.eventsBlockDev) {
                    this.eventsBlockPath = 'http://localhost:4600/file_cbbc42ca-0f20-4ac8-b4c6-8f87ba7c16ad.js';
                }
                this.loaded = true;
            });
    }

    ngOnInit(): void {
        this.hostObject = {
            ...this.hostObject,
            AddonUUID: config.AddonUUID,
            PossibleEvents: [{
                EventKey: 'SetFieldValue',
                EventFilter: '{\"DataObject\":{\"typeDefinition\":{\"internalID\":267286}}}',
                SupportField: true
            },
            {
                EventKey: 'IncrementFieldValue',
                EventFilter: '{\"DataObject\":{\"typeDefinition\":{\"internalID\":267286}}}',
                SupportField: true
            },
            {
                EventKey: 'TransactionScopeLoaded',
                EventFilter: '{\"DataObject\":{\"typeDefinition\":{\"internalID\":267286}}}',
                SupportField: false
            },
            {
                EventKey: 'TransactionScopeLoad',
                EventFilter: '{\"DataObject\":{\"typeDefinition\":{\"internalID\":267286}}}',
                SupportField: false
            }],
            PossibleFields: [
                'TSAInventory',
                'UnitsQuantity',
                'UnitPriceAfterDiscount'
            ],
            Group: '267286',
        }
    }

    ngOnChanges(e: any): void {

    }

    ngAfterViewInit() {
    }
}
