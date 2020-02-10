import {
    ISagaManager,
    ISagaRegistration,
    ISagaWithArguments,
} from "./Contracts";
import { SagaMiddleware, Task } from "redux-saga";
import { sagaEquals } from "./SagaComparer";
import { getMap } from "redux-dynamic-modules-core";

/**
 * Creates saga items which can be used to start and stop sagas dynamically
 */
export function getSagaManager(
    sagaMiddleware: SagaMiddleware<any>
): ISagaManager {
    const tasks = getMap<ISagaRegistration<any>, Task>(sagaEquals);

    return {
        getItems: (): ISagaRegistration<any>[] => [...tasks.keys],
        add: (sagas: ISagaRegistration<any>[]) => {
            if (!sagas) {
                return;
            }
            sagas.forEach(saga => {
                if (saga && !tasks.get(saga)) {
                    tasks.add(saga, runSaga(sagaMiddleware, saga));
                }
            });
        },
        remove: (sagas: ISagaRegistration<any>[]) => {
            if (!sagas) {
                return;
            }
            sagas.forEach(saga => {
                if (tasks.get(saga)) {
                    const task = tasks.remove(saga);
                    task.cancel();
                }
            });
        },
        dispose: () => {
            // Cancel everything
            tasks.keys.forEach(k => tasks.get(k).cancel());
        },
        done: () => {
            // Wait for everything to complete
            // Don't use Promise.all as it rejects on the first rejection
            return tasks.keys
                .map(k => tasks.get(k).done)
                .reduce(
                    async (all, next) => all.then(() => next, () => next),
                    Promise.resolve()
                );
        },
    };
}

function runSaga(
    sagaMiddleware: SagaMiddleware<any>,
    sagaRegistration: ISagaRegistration<any>
): Task {
    if (typeof sagaRegistration === "function") {
        const saga = sagaRegistration as () => Iterator<any>;
        return sagaMiddleware.run(saga);
    }
    const saga = (sagaRegistration as ISagaWithArguments<any>).saga;
    const argument = (sagaRegistration as ISagaWithArguments<any>).argument;
    return sagaMiddleware.run(saga, argument);
}
