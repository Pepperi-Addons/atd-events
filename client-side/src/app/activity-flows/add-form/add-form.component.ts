import { Component, Inject, OnInit, ViewContainerRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { PepDialogData, PepDialogService } from '@pepperi-addons/ngx-lib/dialog';

import { EventsNames, FlowObject, SelectOptions } from 'shared';
import { CreateFormData, UserEvent } from '../../entities'
import { EventsService } from '../../services/events.service';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';

@Component({
  selector: 'block-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.scss']
})
export class AddFormComponent implements OnInit {

  possibleEvents: SelectOptions<string> = [];
  possibleFields: SelectOptions<string> = [];
  eventSupportsField: boolean = true;
  chosenEvent: UserEvent;
  eventKey: string = '';
  eventTitle: string = '';
  eventField: string = '';
  isValid: boolean = false;
  chosenFlow: FlowObject;
  chooseFlowTitle: string = ''

  constructor(
    private dialogRef: MatDialogRef<AddFormComponent>,
    private translate: TranslateService,
    private eventsService: EventsService,
    private addonLoaderService: PepAddonBlockLoaderService,
    @Inject(MAT_DIALOG_DATA) public incoming: CreateFormData
  ) {

    if (incoming.Events.length > 0) {
      this.possibleEvents = incoming.Events.filter(event => incoming.CurrentEvents.get(event.EventKey) === undefined || event.Fields?.length > 0).map(event => {
        return {
          key: event.EventKey,
          value: this.translate.instant(`${event.EventKey}_EventName`)
        }
      });
    }
    this.chooseFlowTitle = translate.instant('AddDialog_FlowPicker')
  }

  ngOnInit(): void {
  }

  chooseFlow() {
    const dialogRef = this.addonLoaderService.loadAddonBlockInDialog({
        container: this.incoming.ViewContainer,
        name: 'FlowPicker',
        hostObject: {
            fields: this.chosenEvent ? this.chosenEvent.EventData : undefined,
            runFlowData: this.chosenFlow
        },
        hostEventsCallback: (event) => {
          console.log('inside callback', event)
            if(event.data && event.data.FlowKey != '') {
              this.chosenFlow = event.data;
              this.isValid = this.isFormValid();
              this.chooseFlowTitle = this.chosenFlow?.FlowKey;
              this.eventsService.searchFlows(this.chosenFlow.FlowKey).then(flows => {
                if (flows?.Objects?.length > 0) {
                  this.chooseFlowTitle = flows.Objects[0].Name || this.chosenFlow.FlowKey;
                }
              })
            }
            else {
              this.chosenFlow = undefined;
              this.isValid = false;
              this.chooseFlowTitle = this.translate.instant('AddDialog_FlowPicker')
            }
            dialogRef.close();
        },
        size: 'large'
    })
  }

  eventKeyChanged(value) {
    this.chosenEvent = this.incoming.Events.find(event => event.EventKey === value);
    if (this.chosenEvent) {
        this.eventSupportsField = this.chosenEvent.Fields?.length > 0 || false;
        this.isValid = this.isFormValid();
        this.eventTitle = this.chosenEvent.Title;
        // if the event support field, we need to filter out the fields already defined for this event
        if (this.chosenEvent.Fields?.length > 0) {
          this.eventField = '';
          this.possibleFields = this.chosenEvent.Fields.filter(field => {
            const events = this.incoming.CurrentEvents.get(this.chosenEvent.EventKey);
            if (events) {
              if (events.find(item => item.FieldID === field.ApiName)) {
                return false;
              }
              else {
                return true;
              }
            }
            return true;
          }).map(field => {
            return {
              key: field.ApiName,
              value: field.Title
            }
          })
        }
    }
    else {
      console.error(`could not find event ${value}`);
    }
  }

  createEvent() {
    this.dialogRef.close({
      EventKey: this.chosenEvent.EventKey as EventsNames,
      FieldID: this.eventSupportsField ? this.eventField : '',
      Flow: this.chosenFlow
    })
  }

  isFormValid() {
    // if event & flow has been chosen than the form is valid
    let result = this.chosenEvent != undefined && this.chosenFlow != undefined;
    
    // if the event support fields, need to make sure we have chosen a field
    if(this.eventSupportsField) {
      result = result && this.eventField != ''
    }

    return result
  }

  close() {
    this.dialogRef.close();
  }

}
