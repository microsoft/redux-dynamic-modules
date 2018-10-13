import { applyMiddleware, compose, createStore, DeepPartial } from "redux";
import { IModule, IModuleStore, IExtension } from "./Contracts";
import { getModuleManager } from "./Managers/ModuleManager";
import { getRefCountedManager } from "./Managers/RefCountedManager";
import { getMiddlewareManager } from './Managers/MiddlewareManager';

/**
 * Configure the module store
 */
export function configureStore<S1>(initialState: DeepPartial<S1>, extensions: IExtension[], reduxModule: IModule<S1>): IModuleStore<S1>;
export function configureStore<S1, S2>(initialState: DeepPartial<S1 & S2>, extensions: IExtension[], m1: IModule<S1>, m2: IModule<S2>): IModuleStore<S1 & S2>;
export function configureStore<S1, S2, S3>(initialState: DeepPartial<S1 & S2 & S3>, extensions: IExtension[], m1: IModule<S1>, m2: IModule<S2>, m3: IModule<S3>): IModuleStore<S1 & S2 & S3>;
export function configureStore<S1, S2, S3, S4>(initialState: DeepPartial<S1 & S2 & S3 & S4>, extensions: IExtension[], m1: IModule<S1>, m2: IModule<S2>, m3: IModule<S3>, m4: IModule<S4>): IModuleStore<S1 & S2 & S3 & S4>;
export function configureStore<S1, S2, S3, S4, S5>(initialState: DeepPartial<S1 & S2 & S3 & S4 & S5>, extensions: IExtension[], m1: IModule<S1>, m2: IModule<S2>, m3: IModule<S3>, m4: IModule<S4>, m5: IModule<S5>): IModuleStore<S1 & S2 & S3 & S4 & S5>;
export function configureStore<S1, S2, S3, S4, S5, S6>(initialState: DeepPartial<S1 & S2 & S3 & S4 & S5 & S6>, extensions: IExtension[], m1: IModule<S1>, m2: IModule<S2>, m3: IModule<S3>, m4: IModule<S4>, m5: IModule<S5>, m6: IModule<S6>): IModuleStore<S1 & S2 & S3 & S4 & S5 & S6>;
export function configureStore<S1, S2, S3, S4, S5, S6, S7>(initialState: DeepPartial<S1 & S2 & S3 & S4 & S5 & S6 & S7>, extensions: IExtension[], m1: IModule<S1>, m2: IModule<S2>, m3: IModule<S3>, m4: IModule<S4>, m5: IModule<S5>, m6: IModule<S6>, m7: IModule<S7>): IModuleStore<S1 & S2 & S3 & S4 & S5 & S6 & S7>;
export function configureStore<S1, S2, S3, S4, S5, S6, S7, S8>(initialState: DeepPartial<S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8>, extensions: IExtension[], m1: IModule<S1>, m2: IModule<S2>, m3: IModule<S3>, m4: IModule<S4>, m5: IModule<S5>, m6: IModule<S6>, m7: IModule<S7>, m8: IModule<S8>): IModuleStore<S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8>;
export function configureStore<State>(initialState: DeepPartial<State>, extensions: IExtension[], ...initialModules: IModule<any>[]): IModuleStore<State>;
export function configureStore<State>(initialState: DeepPartial<State>, extensions: IExtension[], ...initialModules: IModule<any>[]): IModuleStore<State> {
  if (!extensions) {
    extensions = [];
  }

  const extensionMiddleware = extensions.reduce(
    (mw, p) => {
      if (p.middleware) {
        mw.push(...p.middleware)
      }

      return mw;
    },
    []
  );

  let composeEnhancers = compose;

  //@ts-ignore
  if (__DEV__) {
    composeEnhancers = window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] || compose;
  }

  const middlewareManager = getRefCountedManager(getMiddlewareManager(), (a, b) => a === b);
  const enhancer = composeEnhancers(applyMiddleware(...extensionMiddleware, middlewareManager.enhancer));
  const modules = getRefCountedManager(getModuleManager<State>(middlewareManager, extensions), (a: IModule<any>, b: IModule<any>) => a.id === b.id);

  // Create store
  const store: IModuleStore<State> = createStore<State, any, {}, {}>(
    modules.getReducer,
    initialState,
    enhancer
  ) as IModuleStore<State>;

  modules.setDispatch(store.dispatch);

  const addModules = (modulesToBeAdded: IModule<any>[]) => {
    modules.add(modulesToBeAdded);
    return {
      remove: () => {
        modules.remove(modulesToBeAdded);
      }
    };
  }

  const addModule = (moduleToBeAdded: IModule<any>) => {
    return addModules([moduleToBeAdded]);
  };

  extensions.forEach(p => {
    if (p.onModuleManagerCreated) {
      p.onModuleManagerCreated({
        addModule,
        addModules
      });
    }
  });

  store.addModule = addModule;
  store.addModules = addModules;

  store.dispose = () => {
    // get all added modules and remove them
    modules.dispose();
    middlewareManager.dispose();
    extensions.forEach(p => {
      if (p.dispose) {
        p.dispose();
      }
    });
  };


  store.addModules(initialModules);

  return store as IModuleStore<State>;
}
