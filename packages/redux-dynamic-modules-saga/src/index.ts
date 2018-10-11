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
export * from "./SagaExtension";