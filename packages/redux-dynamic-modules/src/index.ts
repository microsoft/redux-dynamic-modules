let target;
if (window) {
    target = window;
}
else {
    //@ts-ignore
    target = global;
}

if (!target["__DEV__"]) {
    target["__DEV__"] = false;
}


export * from "./Contracts";
export * from "./DynamicModuleLoader";
export * from "./ModuleStore";
export * from "./Utils/ComparableMap";
export * from "./Utils/RefCounter";
export * from "./Managers/MiddlewareManager";
export * from "./Managers/RefCountedManager";
