# ATD Events/Flows Architecture

## Overview

The ATD Flows addon consists of server-side, CPI-side, and client-side components.
- Server-side: Manages ATD flow data and handles event configurations by interacting with the Configurations addon.
- CPI-side: Registers and intercepts flow-related events on devices, ensuring offline handling and reloading configurations when changes occur.
- Client-side: Provides two components for managing ATD event flows in the transaction editor, one of which is deprecated (Still provided for backwards support) and replaced by the new event flow system.

---

## Data Model

ATD-flows data is stored using configurations with the ConfigurationSchema name "ATDFlowsConfigurations"

---

## Relations

ATD Flows uses the following relations:
* [AfterSync](https://apidesign.pepperi.com/addon-relations/addons-link-table/relation-names/beforesync-2): Registers events after sync to ensure any updated ATD flows configurations trigger a reload on devices.
* [TransactionTypeListTabs](https://apidesign.pepperi.com/addon-relations/addons-link-table/relation-names/list-menu-entries) and [ActivityTypeListTabs](https://apidesign.pepperi.com/addon-relations/addons-link-table/relation-names/list-menu-entries): Display a tab in transaction or activity editors. These relations are used twice, once for the current events tab and once for the deprecated events tab.
* [ATDExport](https://apidesign.pepperi.com/addon-relations/addons-link-table/relation-names/atd-export-callback): ATD Export callback.
* [ATDImport](https://apidesign.pepperi.com/addon-relations/addons-link-table/relation-names/atd-import-callback): ATD Import callback.
* [UDCEvents](https://apidesign.pepperi.com/addon-relations/addons-link-table/relation-names/user-events): Not created by ATD flows but is used by it. Describes how to register for User Events that are emitted on User Defined Collections

---

## Topics

### Events
#### High Level

ATD Flows provides several key events that trigger specific actions based on user interactions with transactions:

1. OnTransactionLoaded: Fires after a transaction has fully loaded, after the rule engine and transaction scope filter are done.
2. OnTransactionLoad: Occurs when a transaction begins loading, before catalog filtering.
3. OnTransactionFieldChanged: Triggered when a user changes a header field in the transaction.
4. OnTransactionLineFieldChanged: Activated when a field in one of the transaction lines is changed by the user.

---

### Work Flow Action (Custom Events)
#### High Level

ATD Flows allows the integration of new flows into legacy workflows without changing the existing workflow logic. This is useful since certain features, such as scripts, are not supported by the legacy workflow. By triggering custom events, new flows can be run alongside the existing workflow actions. Here's how it works:

1. Workflow Action Trigger: In a workflow, there is an action called AlertOnCondition. Normally, this would display an alert if a condition is met. However, by setting the condition field to a custom field named TSAEmitEventXXX (where XXX is the event name), we can trigger a flow indirectly. If the condition is false (as it will always be in this case), the event XXX is emitted, allowing a flow to be run later based on this event.

2. Once the custom event XXX is emitted, you can configure a flow to run when this event is raised. In the ATD Events tab, select the event XXX from the available events list and assign a flow to it.

Usage example: This logic is used by the Pricing Addon to trigger pricing recalculation once a transaction is submitted.

#### Steps to Configure:

1. Create a Custom Field:
* Navigate to Settings -> Sales Activities -> Transaction Types and enter a transaction type to edit it.
* Go to Fields -> Custom Transaction Field -> Add Custom Field.
* Select Checkbox from the list on the left and name the field, EmitEvent{EventName} for example, EmitEventMyEvent. Using our example, you should see that the Field API Name will now say TSAEmitEventMyEvent. Save the field (default value should be false).

2. Configure the Event in ATD Flows:
* Go to the Events tab and add a new event.
* Select the event we just created, MyEvent, and choose the flow you want to run when this event is triggered. Save the configuration.

3. Set Up the Workflow:
* In the workflows tab, edit a step between nodes (for example between "IN CREATION" and "SUBMITTED").
* Add an action and select AlertOnCondition. Note that it is configured to "Notify when value is: True", which will never happen.
* Select the custom field EmitEventMyEvent and save the configuration.
* Sync the changes to ensure they take effect.


Now, when the workflow is run, the custom event MyEvent will be raised, and the flow you configured will run.
