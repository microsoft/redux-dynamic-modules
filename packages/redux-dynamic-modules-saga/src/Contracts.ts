import { IExtension, IItemManager, IModule } from "redux-dynamic-modules-core";

export interface ISagaWithArguments<T> {
    saga: (argument?: T) => Iterator<any>;
    argument?: T;
}
export type ISagaRegistration<T> =
    | (() => Iterator<any>)
    | ISagaWithArguments<T>;

export interface ISagaManager extends IItemManager<ISagaRegistration<any>> {
  done: () => Promise<any>;
}

export interface ISagaExtension extends IExtension {
  done: () => Promise<any>;
}

export interface ISagaModule<T> extends IModule<T> {
    sagas?: ISagaRegistration<any>[];
}
