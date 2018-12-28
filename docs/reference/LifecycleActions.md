# Lifecycle Actions

In addition to the `initialActions` and `finalActions` properties specified on the module, the `ModuleStore` will also dispatch lifecycle actions that indicate a module has been added or removed.

When a module is added, the `"@@Internal/ModuleManager/ModuleAdded"` action is fired, where the payload is the module id. Similarly, when a module is removed, the `"@@Internal/ModuleManager/ModuleRemoved"` action is fired.
