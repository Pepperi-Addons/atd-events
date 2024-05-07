import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IPepGenericListDataSource, IPepGenericListParams, IPepGenericListActions } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { PepSelectionData } from '@pepperi-addons/ngx-lib/list';
import { EventsService } from '../services/events.service';
import { Draft } from '@pepperi-addons/papi-sdk';
import { EventType } from "shared";

@Component({
  selector: 'activity-flows',
  templateUrl: './activity-flows.component.html',
  styleUrls: ['./activity-flows.component.scss']
})
export class ActivityFlowsComponent implements OnInit {

  createClicked($event: any) {
    throw new Error('Method not implemented.');
  }
  @Input() hostObject: any;

  atdUUID: string;
  draft: Draft;

  constructor(
    private eventsService: EventsService,
    public translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.atdUUID = this.hostObject.objectList[0];
  }

  generateEventName(eventKey: EventType, fieldID?: string): string {
    switch (eventKey) {
      case "OnTransactionLoaded":
        return this.translate.instant("OnTransactionLoaded_EventName");
      case "OnTransactionLoad":
        return this.translate.instant("OnTransactionLoad_EventName");
      case "OnTransactionFieldChanged":
        return this.translate.instant("OnTransactionFieldChanged_EventName", { fieldID: fieldID });
      case "OnTransactionLineFieldChanged":
        return this.translate.instant("OnTransactionLineFieldChanged_EventName", { fieldID: fieldID });
      default:
        return this.translate.instant("Unknown_EventName");
    }
  }

  listDataSource: IPepGenericListDataSource = {
    init: async (parameters: IPepGenericListParams) => {
      this.draft = await this.eventsService.getDraft(this.hostObject.objectList[0]);

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
              FieldID: 'EventName',
              Type: 'TextBox',
              Title: await this.translate.get("ActivityList_DataView_EventTitle_Title").toPromise(),
              Mandatory: true,
              ReadOnly: true
            },
            {
              FieldID: 'FieldID',
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
        items: this.draft.Data.Events.map(event => {
          const eventName = this.generateEventName(event.EventKey, event.FieldID);
          return {
            ...event,
            EventName: eventName
          }
        }),
        totalCount: this.draft.Data.Events.length
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
