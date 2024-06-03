import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IPepGenericListDataSource, IPepGenericListParams, IPepGenericListActions } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { PepSelectionData } from '@pepperi-addons/ngx-lib/list';
import { EventsService } from '../services/events.service';
import { Draft } from '@pepperi-addons/papi-sdk';
import { ATDEventForDraft, EventType, groupBy } from "shared";
import { CreateFormData, UserEvent } from '../entities';
import { AddFormComponent } from './add-form/add-form.component';
import { PepDialogActionsType, PepDialogData, PepDialogService } from '@pepperi-addons/ngx-lib/dialog';

@Component({
  selector: 'activity-flows',
  templateUrl: './activity-flows.component.html',
  styleUrls: ['./activity-flows.component.scss']
})
export class ActivityFlowsComponent implements OnInit {


  @Input() hostObject: any;

  atdUUID: string;
  draft: Draft;
  uiData: { Draft: Draft, PossibleEvents: UserEvent[] };
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
    });
  }

  listDataSource: IPepGenericListDataSource;

  openNonCustomDialog(dialogTitle: string, dialogContent: string, actionType: PepDialogActionsType = 'close', callback?: (event: any) => void) {
    const dialogConfig = this.dialogService.getDialogConfig({}, 'regular');
    const dialogData: PepDialogData = {
      actionsType: actionType,
      content: dialogContent,
      title: dialogTitle,
      actionButtons: [],
      showClose: true,
      showFooter: true,
      showHeader: true
    }
    this.dialogService.openDefaultDialog(dialogData, dialogConfig).afterClosed().subscribe((event) => {
      if (callback) {
        callback(event);
      }
    });
  }

  async GetDataSource(): Promise<IPepGenericListDataSource> {
    this.uiData = await this.eventsService.getUIData(this.atdUUID);
    this.draft = this.uiData.Draft;
    this.events = this.uiData.PossibleEvents;
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
            // to find the event name, we need to find the event object with the same EventKey in the events array
            const eventName = this.events.find(possibleEvent => possibleEvent.EventKey === event.EventKey)?.Title;
            if (!eventName) {
              console.warn(`Event with key ${event.EventKey} was not found in the possible events array`);
            }
            return {
              ...event,
              EventName: eventName ?? event.EventKey,
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
                  this.openNonCustomDialog(dialogTitle, dialogContent);
                })
              }
              else {
                console.error(`A flow was not chosen for the event ${chosenUIEvent.EventKey}`);
                const dialogTitle = this.translate.instant('EditDialog_Failure_Title');
                const dialogContent = this.translate.instant('EditDialog_Failure_No_Flow_Chosen_Content');
                this.openNonCustomDialog(dialogTitle, dialogContent);
              }
            });
          }
        },
        {
          title: this.translate.instant("Delete"),
          handler: async (objs) => {
            const listKey = objs.rows[0]
            const dialogTitle = this.translate.instant('DeleteDialog_Title');
            const dialogContent = this.translate.instant('DeleteDialog_Content');
            this.openNonCustomDialog(dialogTitle, dialogContent, 'cancel-delete', (event) => {
              //even is boolean, true if delete is confirmed, false if canceled
              if (event) {
                this.deleteEvent(listKey);
              }
            });
          }
        }]
      } else return []
    }
  }

  deleteEvent(listKey: string) {
    const updatedEvents = this.draft.Data.Events.filter(event => event.ListKey !== listKey);
    this.draft.Data.Events = updatedEvents;
    this.eventsService.upsertEvent(this.draft).then(event => {
      this.GetDataSource().then(dataSource => {
        this.listDataSource = dataSource;
      });
    }).catch(error => {
      console.log(`event deletion failed with the following error: ${JSON.stringify(error)}`);
      const dialogTitle = this.translate.instant('DeleteDialog_Failure_Title');
      const dialogContent = this.translate.instant('DeleteDialog_Failure_Content');
      this.openNonCustomDialog(dialogTitle, dialogContent);
    })
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
          this.openNonCustomDialog(dialogTitle, dialogContent);
        })
      }
    })

  }
}
