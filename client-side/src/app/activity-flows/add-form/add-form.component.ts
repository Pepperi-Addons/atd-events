import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { PepDialogData, PepDialogService } from '@pepperi-addons/ngx-lib/dialog';

import { EventsNames, SelectOptions } from 'shared';
import { CreateFormData } from '../../entities'
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'block-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.scss']
})
export class AddFormComponent implements OnInit {

  possibleEvents: SelectOptions<string> = [];
  possibleFields: SelectOptions<string> = [];
  eventSupportsField: boolean = true;
  eventKey: string = '';
  eventTitle: string = '';
  eventField: string = '';
  isValid: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<AddFormComponent>,
    private translate: TranslateService,
    private eventsService: EventsService,
    private dialogService: PepDialogService,
    @Inject(MAT_DIALOG_DATA) public incoming: CreateFormData
  ) {

    if (incoming.Events.length > 0) {
      this.possibleEvents = incoming.Events.filter(event => incoming.CurrentEvents.get(event.EventKey) === undefined || event.Fields?.length > 0).map(event => {
        return {
          key: event.EventKey,
          value: event.EventKey
        }
      });
    }
  }

  ngOnInit(): void {
  }

  eventKeyChanged(value) {
    const event = this.incoming.Events.find(event => event.EventKey === value);
    if (event) {
        this.eventSupportsField = event.Fields?.length > 0 || false;
        this.isValid = !this.eventSupportsField;
        this.eventTitle = event.Title;
        // if the event support field, we need to filter out the fields already defined for this event
        if (event.Fields?.length > 0) {
          this.eventField = '';
          this.possibleFields = event.Fields.filter(field => {
            const events = this.incoming.CurrentEvents.get(event.EventKey);
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
    const chosenEvent = this.incoming.Events.find(item => item.EventKey === this.eventKey);
    this.eventsService.upsertEvent({
      EventKey: this.eventKey as EventsNames,
      FieldID: this.eventSupportsField ? this.eventField : '',
      Flow: undefined
    }).then((event => {
      this.dialogRef.close(event);
    })).catch(error => {
      console.log(`event creation failed with the following error: ${JSON.stringify(error)}`);
      const dialogTitle = this.translate.instant('AddDialog_Failure_Title');
      const dialogContent = this.translate.instant('AddDialog_Failure_Content');
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
    })
  }

  close() {
    this.dialogRef.close();
  }

}
