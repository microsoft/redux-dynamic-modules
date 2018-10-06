import { IItemManager, getStringRefCounter } from "redux-dynamic-modules";
import { EpicMiddleware, Epic, combineEpics } from "redux-observable";

export interface IEpicManager extends IItemManager<Epic> {
    rootEpic: Epic;
}

/**
 * Creates an epic manager which manages epics being run in the system
 */
export function getEpicManager(epicMiddleware: EpicMiddleware<any>): IEpicManager {
    let runningEpics: Epic[] = [];
    const epicRefCounter = getStringRefCounter();

    const rootEpic: Epic = combineEpics(...runningEpics);

    return {
        getItems: (): Epic[] => runningEpics,
        rootEpic,
        add: (epics: Epic[]) => {
            if (!epics) {
                return;
            }

            epics.forEach(e => {
                epicRefCounter.add(e.name);
                runningEpics.push(e);
            });
        },
        remove: (epics: Epic[]) => {
            if (!epics) {
                return;
            }

            const epicNameMap = epics.reduce((p, e) => {
                p[e.name] = e;
                return p;
            }, {});

            epics.forEach(e => {
                epicRefCounter.remove(e.name);
            });

            runningEpics = runningEpics.filter(e => {
                !!epicNameMap[e.name] && epicRefCounter.getCount(e.name) !== 0
            });
        },
        dispose: () => {
            runningEpics = null;
        }
    };
}
