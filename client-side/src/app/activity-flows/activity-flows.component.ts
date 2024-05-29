import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IPepGenericListDataSource, IPepGenericListParams, IPepGenericListActions } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { PepSelectionData } from '@pepperi-addons/ngx-lib/list';
import { EventsService } from '../services/events.service';
import { Draft } from '@pepperi-addons/papi-sdk';
import { ATDEventForDraft, EventType, groupBy } from "shared";
import { CreateFormData, UserEvent } from '../entities';
import { AddFormComponent } from './add-form/add-form.component';
import { PepDialogData, PepDialogService } from '@pepperi-addons/ngx-lib/dialog';

@Component({
  selector: 'activity-flows',
  templateUrl: './activity-flows.component.html',
  styleUrls: ['./activity-flows.component.scss']
})
export class ActivityFlowsComponent implements OnInit {


  @Input() hostObject: any;

  atdUUID: string;
  draft: Draft;
  events: UserEvent[];

  constructor(
    private eventsService: EventsService,
    public translate: TranslateService,
    private dialogService: PepDialogService,
    private viewContainer: ViewContainerRef,
  ) {
  }

  ngOnInit(): void {
    this.atdUUID = this.hostObject.objectList[0];
    this.GetDataSource().then(dataSource => {
      this.listDataSource = dataSource
    })
    this.eventsService.getTransactionEvents(this.atdUUID).then(events => {
      this.events = events as unknown as UserEvent[]
    });
  }

  listDataSource: IPepGenericListDataSource;

  openFailureDialog(dialogTitle: string, dialogContent: string) {
    const dialogConfig = this.dialogService.getDialogConfig({}, 'regular');
    const dialogData: PepDialogData = {
      actionsType: 'close',
      content: dialogContent,
      title: dialogTitle,
      actionButtons: [],
      showClose: true,
      showFooter: true,
      showHeader: true
    }
    this.dialogService.openDefaultDialog(dialogData, dialogConfig);
  }

  async GetDataSource(): Promise<IPepGenericListDataSource> {
    this.draft = await this.eventsService.getDraft(this.hostObject.objectList[0]);
    return {
      init: async (parameters: IPepGenericListParams) => {

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
          totalCount: this.draft.Data.Events.length,
        };
      },
      inputs: {
        emptyState: {
          title: '',
          description: '',
          show: this.draft.Data.Events.length <= 0
        }
      }
    }
  }

  actions: IPepGenericListActions = {
    get: async (data: PepSelectionData) => {
      if (data.rows.length) {
        return [{
          title: this.translate.instant("Edit"),
          handler: async (objs) => {
            const listKey = objs.rows[0]
            const chosenUIEvent = this.draft.Data.Events.find(event => event.ListKey === listKey);
            const chosenEvent = this.events.find(event => event.EventKey === chosenUIEvent.EventKey);
            // I am making a copy of the flow object to avoid changing the original object
            this.eventsService.chooseFlow(this.viewContainer, chosenEvent ? chosenEvent.EventData : undefined, (JSON.parse(JSON.stringify(chosenUIEvent.Flow))), (event) => {
              if (event.data && event.data.FlowKey != '') {
                // update the flow in the chosenUIEvent
                chosenUIEvent.Flow = event.data;
                // replace the chosenUIEvent in the draft
                this.draft.Data.Events = this.draft.Data.Events.map(event => event.ListKey === listKey ? chosenUIEvent : event);
                // update the draft
                this.eventsService.upsertEvent(this.draft).then(event => {
                  this.GetDataSource().then(dataSource => {
                    this.listDataSource = dataSource;
                  });
                }).catch(error => {
                  console.log(`event editing failed with the following error: ${JSON.stringify(error)}`);
                  const dialogTitle = this.translate.instant('EditDialog_Failure_Title');
                  const dialogContent = this.translate.instant('EditDialog_Failure_Content');
                  this.openFailureDialog(dialogTitle, dialogContent);
                })
              }
              else {
                console.error(`A flow was not chosen for the event ${chosenUIEvent.EventKey}`);
                const dialogTitle = this.translate.instant('EditDialog_Failure_Title');
                const dialogContent = this.translate.instant('EditDialog_Failure_No_Flow_Chosen_Content');
                this.openFailureDialog(dialogTitle, dialogContent);
              }
            });
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
    const groupedEvents = groupBy(this.draft.Data.Events, (item) => item.EventKey);
    const formData: CreateFormData = {
      Events: this.events as unknown as UserEvent[],
      CurrentEvents: groupedEvents,
      ViewContainer: this.viewContainer,
      ObjectKey: this.atdUUID
    }
    const dialogConfig = this.dialogService.getDialogConfig({}, 'small');
    dialogConfig.data = {
      content: AddFormComponent
    }

    this.dialogService.openDialog(AddFormComponent, formData, dialogConfig).afterClosed().subscribe((createdEvent: ATDEventForDraft) => {
      if (createdEvent) {
        this.draft.Data.Events.push(createdEvent);
        this.eventsService.upsertEvent(this.draft).then(event => {
          this.GetDataSource().then(dataSource => {
            this.listDataSource = dataSource;
          });
        }).catch(error => {
          console.log(`event creation failed with the following error: ${JSON.stringify(error)}`);
          const dialogTitle = this.translate.instant('AddDialog_Failure_Title');
          const dialogContent = this.translate.instant('AddDialog_Failure_Content');
          this.openFailureDialog(dialogTitle, dialogContent);
        })
      }
    })

  }
}
