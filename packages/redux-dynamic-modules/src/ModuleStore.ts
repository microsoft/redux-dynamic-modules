import { applyMiddleware, compose, createStore, DeepPartial } from "redux";
import { IModule, IModuleStore, IPlugin } from "./Contracts";
import { getModuleManager } from "./Managers/ModuleManager";
import { getRefCountedManager } from "./Managers/RefCountedManager";
import { getMiddlewareManager } from './Managers/MiddlewareManager';

/**
 * Configure the module store
 */
export function configureStore<SagaContext, S1>(initialState: DeepPartial<S1>, plugins: IPlugin[], reduxModule: IModule<S1>): IModuleStore<S1>;
export function configureStore<SagaContext, S1, S2>(initialState: DeepPartial<S1 & S2>, plugins: IPlugin[], m1: IModule<S1>, m2: IModule<S2>): IModuleStore<S1 & S2>;
export function configureStore<SagaContext, S1, S2, S3>(initialState: DeepPartial<S1 & S2 & S3>, plugins: IPlugin[], m1: IModule<S1>, m2: IModule<S2>, m3: IModule<S3>): IModuleStore<S1 & S2 & S3>;
export function configureStore<SagaContext, S1, S2, S3, S4>(initialState: DeepPartial<S1 & S2 & S3 & S4>, plugins: IPlugin[], m1: IModule<S1>, m2: IModule<S2>, m3: IModule<S3>, m4: IModule<S4>): IModuleStore<S1 & S2 & S3 & S4>;
export function configureStore<SagaContext, S1, S2, S3, S4, S5>(initialState: DeepPartial<S1 & S2 & S3 & S4 & S5>, plugins: IPlugin[], m1: IModule<S1>, m2: IModule<S2>, m3: IModule<S3>, m4: IModule<S4>, m5: IModule<S5>): IModuleStore<S1 & S2 & S3 & S4 & S5>;
export function configureStore<SagaContext, S1, S2, S3, S4, S5, S6>(initialState: DeepPartial<S1 & S2 & S3 & S4 & S5 & S6>, plugins: IPlugin[], m1: IModule<S1>, m2: IModule<S2>, m3: IModule<S3>, m4: IModule<S4>, m5: IModule<S5>, m6: IModule<S6>): IModuleStore<S1 & S2 & S3 & S4 & S5 & S6>;
export function configureStore<SagaContext, S1, S2, S3, S4, S5, S6, S7>(initialState: DeepPartial<S1 & S2 & S3 & S4 & S5 & S6 & S7>, plugins: IPlugin[], m1: IModule<S1>, m2: IModule<S2>, m3: IModule<S3>, m4: IModule<S4>, m5: IModule<S5>, m6: IModule<S6>, m7: IModule<S7>): IModuleStore<S1 & S2 & S3 & S4 & S5 & S6 & S7>;
export function configureStore<SagaContext, S1, S2, S3, S4, S5, S6, S7, S8>(initialState: DeepPartial<S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8>, plugins: IPlugin[], m1: IModule<S1>, m2: IModule<S2>, m3: IModule<S3>, m4: IModule<S4>, m5: IModule<S5>, m6: IModule<S6>, m7: IModule<S7>, m8: IModule<S8>): IModuleStore<S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8>;
export function configureStore<SagaContext, State>(initialState: DeepPartial<State>, plugins: IPlugin[], ...initialModules: IModule<any>[]): IModuleStore<State>;
export function configureStore<SagaContext, State>(initialState: DeepPartial<State>, plugins: IPlugin[], ...initialModules: IModule<any>[]): IModuleStore<State> {
  if (!plugins) {
    plugins = [];
  }

  const pluginMiddleware = plugins.reduce(
    (mw, p) => {
      if (p.middleware) {
        mw.push(...p.middleware)
      }

      return mw;
    },
    []
  );

  const composeEnhancers = compose;
  const middlewareManager = getRefCountedManager(getMiddlewareManager(), (a, b) => a === b);
  const enhancer = composeEnhancers(applyMiddleware(...pluginMiddleware, middlewareManager.dynamicMiddleware));
  const modules = getRefCountedManager(getModuleManager<State>(middlewareManager, plugins), (a: IModule<any>, b: IModule<any>) => a.id === b.id);

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

  plugins.forEach(p => {
    if (p.onModuleManagerCreated) {
      p.onModuleManagerCreated({
        addModule,
        addModules
      });
    }
  });

  store.dispose = () => {
    // get all added modules and remove them
    const allModules = modules.getItems();
    modules.remove(allModules);
    plugins.forEach(p => {
      if (p.dispose) {
        p.dispose();
      }
    });
  };


  store.addModules(initialModules);

  return store as IModuleStore<State>;
}
