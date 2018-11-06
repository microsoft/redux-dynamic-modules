import { createStore as reduxCreateStore, DeepPartial } from "redux";
import { IModule, IModuleStore, IExtension } from "./Contracts";
import { moduleEnhancer } from './ModuleEnhancer';

/**
 * Configure the module store
 */
export function createStore<S1>(initialState: DeepPartial<S1>, extensions: IExtension[], reduxModule: IModule<S1>): IModuleStore<S1>;
export function createStore<S1, S2>(initialState: DeepPartial<S1 & S2>, extensions: IExtension[], m1: IModule<S1>, m2: IModule<S2>): IModuleStore<S1 & S2>;
export function createStore<S1, S2, S3>(initialState: DeepPartial<S1 & S2 & S3>, extensions: IExtension[], m1: IModule<S1>, m2: IModule<S2>, m3: IModule<S3>): IModuleStore<S1 & S2 & S3>;
export function createStore<S1, S2, S3, S4>(initialState: DeepPartial<S1 & S2 & S3 & S4>, extensions: IExtension[], m1: IModule<S1>, m2: IModule<S2>, m3: IModule<S3>, m4: IModule<S4>): IModuleStore<S1 & S2 & S3 & S4>;
export function createStore<S1, S2, S3, S4, S5>(initialState: DeepPartial<S1 & S2 & S3 & S4 & S5>, extensions: IExtension[], m1: IModule<S1>, m2: IModule<S2>, m3: IModule<S3>, m4: IModule<S4>, m5: IModule<S5>): IModuleStore<S1 & S2 & S3 & S4 & S5>;
export function createStore<S1, S2, S3, S4, S5, S6>(initialState: DeepPartial<S1 & S2 & S3 & S4 & S5 & S6>, extensions: IExtension[], m1: IModule<S1>, m2: IModule<S2>, m3: IModule<S3>, m4: IModule<S4>, m5: IModule<S5>, m6: IModule<S6>): IModuleStore<S1 & S2 & S3 & S4 & S5 & S6>;
export function createStore<S1, S2, S3, S4, S5, S6, S7>(initialState: DeepPartial<S1 & S2 & S3 & S4 & S5 & S6 & S7>, extensions: IExtension[], m1: IModule<S1>, m2: IModule<S2>, m3: IModule<S3>, m4: IModule<S4>, m5: IModule<S5>, m6: IModule<S6>, m7: IModule<S7>): IModuleStore<S1 & S2 & S3 & S4 & S5 & S6 & S7>;
export function createStore<S1, S2, S3, S4, S5, S6, S7, S8>(initialState: DeepPartial<S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8>, extensions: IExtension[], m1: IModule<S1>, m2: IModule<S2>, m3: IModule<S3>, m4: IModule<S4>, m5: IModule<S5>, m6: IModule<S6>, m7: IModule<S7>, m8: IModule<S8>): IModuleStore<S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8>;
export function createStore<State>(initialState: DeepPartial<State>, extensions: IExtension[], ...initialModules: IModule<any>[]): IModuleStore<State>;
export function createStore<State>(initialState: DeepPartial<State>, extensions: IExtension[], ...initialModules: IModule<any>[]): IModuleStore<State> {
    return reduxCreateStore(
        /* reducer */undefined,
        initialState,
        moduleEnhancer(extensions, initialModules)
    );
}