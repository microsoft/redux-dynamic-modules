import { Action as ReduxAction } from "redux";
// tslint:disable-next-line:interface-name
export interface Action<T> extends ReduxAction<T> {
    /**
     * The meta property for the action (see Flux Standard Actions)
     */
    meta?: { [key: string]: any };
}

/**
 * A better typing for the Redux Action
 */
// tslint:disable-next-line:interface-name
export interface ActionWithPayload<T extends string, P> extends Action<T> {
    /**
     * The payload of this action
     */
    payload: P;
}

/**
 * Create a new action with type and payload
 * @param type The action type
 * @param payload The payload
 */
export function createAction<T extends string>(type: T): Action<T>;
export function createAction<T extends string, P>(
    type: T,
    payload: P,
    meta?: { [key: string]: string }
): ActionWithPayload<T, P>;
// tslint:disable-next-line:typedef
export function createAction<T extends string, P>(
    type: T,
    payload?: P,
    meta?: { [key: string]: string }
) {
    return { type, payload, meta };
}

/**
 * @copyright Copyright (c) 2018 Martin Hochel
 * Borrowed from the rex-tils library
 */

type ActionsCreatorsMapObject = {
    [actionCreator: string]: (...args: any[]) => any;
};
export type ActionsUnion<A extends ActionsCreatorsMapObject> = ReturnType<
    A[keyof A]
>;
export type ActionsOfType<
    ActionUnion,
    ActionType extends string
> = ActionUnion extends Action<ActionType> ? ActionUnion : never;

export type StringMap<T> = { [key: string]: T };
