import { IModule } from "redux-dynamic-modules";
import { Epic } from "redux-observable";

export interface IEpicModule<T> extends IModule<T> {
    epics?: Epic[];
}
