import { getStringRefCounter, IItemManager } from "redux-dynamic-modules-core";
import { Epic } from "redux-observable";
import { merge } from "rxjs";

export interface IEpicManager extends IItemManager<Epic> {
    rootEpic: Epic;
}

/**
 * Creates an epic manager which manages epics being run in the system
 */
export function getEpicManager(): IEpicManager {
    let runningEpics: Epic[] = [];
    const epicRefCounter = getStringRefCounter();

    const rootEpic: Epic = createRootEpic(runningEpics);

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
                !!epicNameMap[e.name] && epicRefCounter.getCount(e.name) !== 0;
            });
        },
        dispose: () => {
            runningEpics = null;
        },
    };
}

function createRootEpic(runningEpics: Epic[]): Epic {
    const merger = (...args) =>
        merge(
            runningEpics.map(epic => {
                //@ts-ignore
                const output$ = epic(...args);
                if (!output$) {
                    throw new TypeError(
                        `combineEpics: one of the provided Epics "${epic.name ||
                            "<anonymous>"}" does not return a stream. Double check you\'re not missing a return statement!`
                    );
                }
                return output$;
            })
        );

    // Technically the `name` property on Function's are supposed to be read-only.
    // While some JS runtimes allow it anyway (so this is useful in debugging)
    // some actually throw an exception when you attempt to do so.
    try {
        Object.defineProperty(merger, "name", {
            value: "____MODULES_ROOT_EPIC",
        });
    } catch (e) {}

    return merger;
}
