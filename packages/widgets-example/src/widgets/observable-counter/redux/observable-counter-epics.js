import { filter, delay, mapTo } from "rxjs/operators";
export const pingEpic = action$ => action$.pipe(
    filter(action => action.type === 'PING'),
    delay(1000), // Asynchronously wait 1000ms then continue
    mapTo({ type: "Counter/Increment" }),
    mapTo({ type: 'PONG' }),
);

export const pongEpic = action$ => action$.pipe(
    filter(action => action.type === 'PONG'),
    delay(1000), // Asynchronously wait 1000ms then continue
    mapTo({ type: "Counter/Increment" }),
    mapTo({ type: 'PING' }),
);