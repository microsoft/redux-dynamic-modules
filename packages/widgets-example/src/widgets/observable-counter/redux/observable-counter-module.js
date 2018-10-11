import { observableCounterReducer } from "./observable-counter-reducer";
import { pingEpic, pongEpic } from "./observable-counter-epics";

export function getObservableCounterModule() {
    return {
        id: "observable-counter",
        initialActions: [{ type: "Counter/Increment" }, { type: 'PING' }],
        reducerMap: {
            counterAwareState: observableCounterReducer
        },
        epics: [pingEpic, pongEpic]
    };
}


