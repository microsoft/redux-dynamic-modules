import { useContext, useEffect } from "react";
import { IModuleStore, IModule } from "redux-dynamic-modules";
//@ts-ignore
import { Provider, ReactReduxContext } from "react-redux";

export function useModules(modules: IModule<any>[]) {
    const reactReduxContext:
        | { store: IModuleStore<any> }
        | undefined = useContext(ReactReduxContext);

    if (!reactReduxContext) {
        throw new Error(
            "Could not find ReactReduxContext in the React context. Ensure you have rendered this component within a react-redux.Provider component"
        );
    }

    const store: IModuleStore<any> = reactReduxContext.store;
    const addedModule = store.addModules(modules);

    return useEffect(() => addedModule.remove);
}
