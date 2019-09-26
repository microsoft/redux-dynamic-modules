import { IModule } from "redux-dynamic-modules-core";
import { Epic } from "redux-observable";

export interface IEpicModule<T> extends IModule<T> {
    epics?: Epic[];
}
