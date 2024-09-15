# ATD Events/Flows

## High Level

ATD Flows allow users to run predefined flows when certain events occur during a transaction. These events, like the transaction loading or a field being changed, trigger flows that handle specific actions in response.

---

## Releases
| Version | Description | Migration |
|-------- |------------ |---------- |
| 0.6     | make atd events run flows | When migrating from the old event method, there is no automatic process. Users must manually create flows and assign them to the corresponding events. Both the deprecated and new events tabs will exist, and if an event is defined in both, the new flow-based event will take precedence. |
| 0.5     | Load, Set Value & WF Events support | - |

---

## Deployment

After a PR is merged into a release branch a version will be published and the exported integration tests will run. If the tests pass the version will be marked as available.

---

## Debugging

### Local Debugging for ATD-Flows Functions
- Use the Postman localhost folder to debug atd-flows functions locally by simulating API requests.
- Delete `outFiles` values in `launch.json`. This will allow you to debug the ts files directly and not the compiled js files.

### Online specific
- Log groups: 
  - `/aws/lambda/ExecuteAddonSync` - own logs

### Debugging ATD Flows Tabs
The ATD Flows addon provides two tabs in the transaction editor:
1. `ActivityFlowsComponent` for the current flow-based events.
2. `ActivityEventsComponent` for the deprecated event system.
These tabs are supplied via a relation and can be debugged similarly to logic blocks. To debug these components:

1. In the client side of ATD-flows, run `ng serve --port XXXX` (with a chosen port number).
2. Add a devBlocks URL parameter in the transaction editor URL.
3. Map the component (ActivityFlowsComponent or ActivityEventsComponent) to the local file using an array. For example:
`?devBlocks=[["ActivityFlowsComponent","http://localhost:4800/file_316afc44-af38-4354-ac4c-22011cb0ea84.js"]]`
By doing this, the system will load the component from your local environment for debugging.

---

## Testing

There are currently no tests for the ATD Flows addon.

---

## Dependencies

| Addon | Usage |
|-------- |------------ |
| configurations  | handles draft data management  |
---

## APIs
There are no official APIs for the ATD Flows addon.
For internal use, see the [Postman Collection](./atd-flows.postman_collection.json)

---

## Architecture
see: [Architecture](./architecture.md)
