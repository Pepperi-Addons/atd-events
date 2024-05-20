import { ATDEventForUI, EventDataFields } from "shared";

export interface UserEvent {
    Title: string;
    EventKey: string;
    Fields: [{
        ApiName: string;
        Title: string;
    }];
    EventData: EventDataFields;
}

export interface CreateFormData {
    Events: UserEvent[];
    CurrentEvents: Map<string, ATDEventForUI[]>
}
