import { applyMiddleware, compose, createStore, DeepPartial } from "redux";
import { default as createSagaMiddleware, SagaMiddleware } from "redux-saga";
import { IModule, IModuleStore } from "./Contracts";
import { getModuleManager } from "./Managers/ModuleManager";
import { getRefCountedManager } from "./Managers/RefCountedManager";

/**
 * Configure the module store
 */
export function configureStore<SagaContext, S1>(initialState: DeepPartial<S1>, context: SagaContext, reduxModule: IModule<S1>): IModuleStore<S1>;
export function configureStore<SagaContext, S1, S2>(initialState: DeepPartial<S1 & S2>, context: SagaContext, m1: IModule<S1>, m2: IModule<S2>): IModuleStore<S1 & S2>;
export function configureStore<SagaContext, S1, S2, S3>(initialState: DeepPartial<S1 & S2 & S3>, context: SagaContext, m1: IModule<S1>, m2: IModule<S2>, m3: IModule<S3>): IModuleStore<S1 & S2 & S3>;
export function configureStore<SagaContext, S1, S2, S3, S4>(initialState: DeepPartial<S1 & S2 & S3 & S4>, context: SagaContext, m1: IModule<S1>, m2: IModule<S2>, m3: IModule<S3>, m4: IModule<S4>): IModuleStore<S1 & S2 & S3 & S4>;
export function configureStore<SagaContext, S1, S2, S3, S4, S5>(initialState: DeepPartial<S1 & S2 & S3 & S4 & S5>, context: SagaContext, m1: IModule<S1>, m2: IModule<S2>, m3: IModule<S3>, m4: IModule<S4>, m5: IModule<S5>): IModuleStore<S1 & S2 & S3 & S4 & S5>;
export function configureStore<SagaContext, S1, S2, S3, S4, S5, S6>(initialState: DeepPartial<S1 & S2 & S3 & S4 & S5 & S6>, context: SagaContext, m1: IModule<S1>, m2: IModule<S2>, m3: IModule<S3>, m4: IModule<S4>, m5: IModule<S5>, m6: IModule<S6>): IModuleStore<S1 & S2 & S3 & S4 & S5 & S6>;
export function configureStore<SagaContext, S1, S2, S3, S4, S5, S6, S7>(initialState: DeepPartial<S1 & S2 & S3 & S4 & S5 & S6 & S7>, context: SagaContext, m1: IModule<S1>, m2: IModule<S2>, m3: IModule<S3>, m4: IModule<S4>, m5: IModule<S5>, m6: IModule<S6>, m7: IModule<S7>): IModuleStore<S1 & S2 & S3 & S4 & S5 & S6 & S7>;
export function configureStore<SagaContext, S1, S2, S3, S4, S5, S6, S7, S8>(initialState: DeepPartial<S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8>, context: SagaContext, m1: IModule<S1>, m2: IModule<S2>, m3: IModule<S3>, m4: IModule<S4>, m5: IModule<S5>, m6: IModule<S6>, m7: IModule<S7>, m8: IModule<S8>): IModuleStore<S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8>;
export function configureStore<SagaContext, State>(initialState: DeepPartial<State>, context: SagaContext, ...initialModules: IModule<any>[]): IModuleStore<State>;
export function configureStore<SagaContext, State>(initialState: DeepPartial<State>, context: SagaContext, ...initialModules: IModule<any>[]): IModuleStore<State> {
  // setup the saga middleware
  const sagaMonitor = window["__SAGA_MONITOR_EXTENSION__"] || undefined;
  const sagaMiddleware: SagaMiddleware<SagaContext> = createSagaMiddleware<any>(
    {
      context,
      sagaMonitor
    }
  );

  const composeEnhancers = compose;
  const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware));
  const modules = getRefCountedManager(getModuleManager<SagaContext, State>(sagaMiddleware), (a: IModule<any>, b: IModule<any>) => a.id === b.id);

  // Create store
  const store: IModuleStore<State> = createStore<State, any, {}, {}>(
    modules.getReducer,
    initialState,
    enhancer
  ) as IModuleStore<State>;

  modules.setDispatch(store.dispatch);

  const addModule = (...moduleToBeAdded: IModule<any>[]) => {

    modules.add(moduleToBeAdded);
    return {
      remove: () => {
        modules.remove(moduleToBeAdded);
      }
    };
  };

  // Add the module manager to the context
  context["moduleManager"] = {
    addModule
  };

  store.addModule = addModule;
  store.dispose = () => {
    // get all added modules and remove them
    const allModules = modules.getItems();
    modules.remove(allModules);
  };


  store.addModule(...initialModules);

  return store as IModuleStore<State>;
}
