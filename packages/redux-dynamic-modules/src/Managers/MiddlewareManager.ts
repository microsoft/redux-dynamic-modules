//inspired from https://github.com/pofigizm/redux-dynamic-middlewares

import { compose, Middleware } from "redux";
import { IItemManager } from "../Contracts";

export interface IDynamicMiddlewareManager extends IItemManager<Middleware> {
    dynamicMiddleware: Middleware;
    resetMiddlewares: () => void;
}
export const getMiddlewareManager = (): IDynamicMiddlewareManager => {
    let allDynamicMiddlewares: Middleware[] = [];

    const dynamicMiddleware = store => next => (action) => {
        const chain: Function[] = allDynamicMiddlewares.map(m => m(store))

        return compose<(action) => any>(...chain)(next)(action);
    }

    const add = (middlewares: Middleware[]) => {
        allDynamicMiddlewares = [...allDynamicMiddlewares, ...middlewares];
        return middlewares;
    }

    const remove = (middlewares: Middleware[]) => {
        middlewares.forEach(middleware => {
            const index = allDynamicMiddlewares.findIndex(d => d === middleware)

            if (index === -1) {
                // eslint-disable-next-line no-console
                console.error('Middleware does not exist!', middleware)

                return
            }

            allDynamicMiddlewares = allDynamicMiddlewares.filter((_, mdwIndex) => mdwIndex !== index)
        });
        return middlewares;
    }

    const resetMiddlewares = () => {
        allDynamicMiddlewares = []
    }

    return {
        getItems: () => allDynamicMiddlewares,
        dynamicMiddleware,
        add,
        remove,
        resetMiddlewares,
        dispose: () => { allDynamicMiddlewares = [] }
    }
}
