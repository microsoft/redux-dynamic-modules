import { observableCounterReducer } from "./observable-counter-reducer";
import { combineEpics } from 'redux-observable';
import { pingEpic, pongEpic } from "./observable-counter-epics";

const rootEpic = combineEpics(
    pingEpic,
    pongEpic
);

export function getObservableCounterModule() {
    return {
        id: "observable-counter",
        initialActions: [{ type: "Counter/Increment" }, { type: 'PING' }],
        reducerMap: {
            counterAwareState: observableCounterReducer
        },
        epics: [rootEpic]
    };
}


