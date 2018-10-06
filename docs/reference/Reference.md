# Documentation



**Module Store**

Instead of using the redux Store interface you need to use IModuleStore, which extends redux store and provides additional functions to add/remove modules on demand.

```
export interface IModuleManager {
  /**
   * Add the given module to the store
   */
  addModule: (...modules: IModule<any>[]) => IDynamicallyAddedModule
}

export type IModuleStore<State> = Store<State> & IModuleManager & {
  /**
   * Remove all the modules from the store
   */
  dispose: () => void;
};

export interface IDynamicallyAddedModule {
  /**
   * Call to remove the module from the store
   */
  remove: () => void;
}
```
