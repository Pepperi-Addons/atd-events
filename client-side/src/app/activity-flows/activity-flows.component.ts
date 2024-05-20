import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IPepGenericListDataSource, IPepGenericListParams, IPepGenericListActions } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { PepSelectionData } from '@pepperi-addons/ngx-lib/list';
import { EventsService } from '../services/events.service';
import { Draft } from '@pepperi-addons/papi-sdk';
import { ATDEventForDraft, EventType, groupBy } from "shared";
import { CreateFormData, UserEvent } from '../entities';
import { AddFormComponent } from './add-form/add-form.component';
import { PepDialogService } from '@pepperi-addons/ngx-lib/dialog';

@Component({
  selector: 'activity-flows',
  templateUrl: './activity-flows.component.html',
  styleUrls: ['./activity-flows.component.scss']
})
export class ActivityFlowsComponent implements OnInit {

  
  @Input() hostObject: any;

  atdUUID: string;
  draft: Draft;

  constructor(
    private eventsService: EventsService,
    public translate: TranslateService,
    private dialogService: PepDialogService,
  ) {
  }

  ngOnInit(): void {
    this.atdUUID = this.hostObject.objectList[0];
  }

  listDataSource: IPepGenericListDataSource = {
    init: async (parameters: IPepGenericListParams) => {
      this.draft = await this.eventsService.getDraft(this.hostObject.objectList[0]);

      return {
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
          const eventName = this.translate.instant(`${event.EventKey}_EventName`)
          return {
            ...event,
            EventName: eventName
          }
        }),
        totalCount: this.draft.Data.Events.length
      };
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

  createClicked($event: any) {
    const events = this.eventsService.getTransactionEvents(this.atdUUID).then(events => {
      const groupedEvents = groupBy(this.draft.Data.Events, (item) => item.EventKey);
      const formData: CreateFormData = {
          Events: events as unknown as UserEvent[],
          CurrentEvents: groupedEvents,
      }
      const dialogConfig = this.dialogService.getDialogConfig({}, 'regular');
      dialogConfig.data = {
          content: AddFormComponent
      }
  
      this.dialogService.openDialog(AddFormComponent, formData, dialogConfig).afterClosed().subscribe((createdEvent: ATDEventForDraft) => {
          if (createdEvent) {
            this.draft.Data.Events.push(createdEvent);
          }
      })
    });
  }
}
