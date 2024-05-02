import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators'

import { config } from '../addon.config'
import { EventsService } from '../services/events.service';
import { IPepGenericListActions, IPepGenericListDataSource, IPepGenericListParams } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { PepSelectionData } from '@pepperi-addons/ngx-lib/list';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'activity-events',
  templateUrl: './activity-events.component.html',
  styleUrls: ['./activity-events.component.scss']
})
export class ActivityEventsComponent implements OnInit, AfterViewInit {
  createClicked($event: any) {
    throw new Error('Method not implemented.');
  }
  @Input() hostObject: any;

  @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();


  @ViewChild('eventsABI', { read: ViewContainerRef }) eventsContainer: ViewContainerRef;

  eventsBlockPath = '';
  eventsBlockDev = false;
  loaded = false;
  items;


  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private eventsService: EventsService,
    public translate: TranslateService
  ) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.eventsBlockDev = this.activateRoute.snapshot.queryParams.events_dev === "true" || false;
      if (this.eventsBlockDev) {
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

  listDataSource: IPepGenericListDataSource = {
    init: async (parameters: IPepGenericListParams) => {
      this.items = await this.eventsService.getEvents(this.hostObject.objectList[0]);

      return Promise.resolve({
        dataView: {
          Context: {
            Name: '',
            Profile: { InternalID: 0 },
            ScreenSize: 'Landscape'
          },
          Type: 'Grid',
          Title: 'Events Flows list',
          Fields: [
            {
              FieldID: 'EventTitle',
              Type: 'TextBox',
              Title: await this.translate.get("ActivityList_DataView_EventTitle_Title").toPromise(),
              Mandatory: true,
              ReadOnly: true
            },
            {
              FieldID: 'EventField',
              Type: 'TextBox',
              Title: await this.translate.get("ActivityList_DataView_EventField_Title").toPromise(),
              Mandatory: false,
              ReadOnly: true
            },
            {
              FieldID: 'FlowName',
              Type: 'TextBox',
              Title: await this.translate.get("ActivityList_DataView_FlowName_Title").toPromise(),
              Mandatory: true,
              ReadOnly: true
            }

          ],
          Columns: [
            {
              Width: 10
            },
            {
              Width: 10
            },
            {
              Width: 10
            }
          ],
          FrozenColumnsCount: 0,
          MinimumColumnWidth: 0
        },
        items: this.items,
        totalCount: this.items.length
      });
    },
  }

  actions: IPepGenericListActions = {
    get: async (data: PepSelectionData) => {
      if (data.rows.length) {
        return [{
          title: this.translate.instant("Edit"),
          handler: async (objs) => {
            // when this is implemented - need to open dialog with the flow selection
            // reminder - the selected event is in objs.rows[0]
          }
        },
        {
          title: this.translate.instant("Delete"),
          handler: async (objs) => {
            // when this is implemented - need to delete the selected event
            // reminder - the selected event is in objs.rows[0]
          }
        }]
      } else return []
    }
  }
}
