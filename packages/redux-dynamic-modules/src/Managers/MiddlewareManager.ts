//inspired from https://github.com/pofigizm/redux-dynamic-middlewares

import { Middleware } from "redux";
import { IItemManager } from "../Contracts";
import { createDynamicMiddlewares } from "redux-dynamic-middlewares";

export interface IDynamicMiddlewareManager extends IItemManager<Middleware> {
    enhancer: Middleware;
}
export const getMiddlewareManager = (): IDynamicMiddlewareManager => {
    const dynamicMiddlewaresInstance = createDynamicMiddlewares();
    const add = (middlewares: Middleware[]) => {
        dynamicMiddlewaresInstance.addMiddleware(...middlewares);
        return middlewares;
    };

    const remove = (middlewares: Middleware[]) => {
        middlewares.forEach(dynamicMiddlewaresInstance.removeMiddleware);
        return middlewares;
    };

    return {
        getItems: () => [],
        enhancer: dynamicMiddlewaresInstance.enhancer,
        add,
        remove,
        dispose: () => {
            dynamicMiddlewaresInstance.resetMiddlewares();
        },
    };
};
