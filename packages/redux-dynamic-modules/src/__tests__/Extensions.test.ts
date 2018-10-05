import { IExtension, IModuleStore } from "../Contracts";
import { configureStore } from "../ModuleStore";
import { Middleware } from "redux";

describe("Store with extensions", () => {
    let testExtension: IExtension;
    let testStore: IModuleStore<{}>;

    beforeEach(() => {
        testExtension = {
            onModuleAdded: jest.fn(),
            onModuleManagerCreated: jest.fn(),
            onModuleRemoved: jest.fn(),
            dispose: jest.fn()
        }
    });

    it("Registers additional middleware", () => {
        const middlewareFunction = jest.fn();

        const middleware: Middleware = (api) => (next) => (action) => {
            middlewareFunction();
        };
        testExtension.middleware = [middleware];
        testStore = configureStore({}, [testExtension]);

        testStore.dispatch({ type: "ANY" });
        expect(middlewareFunction).toHaveBeenCalled();
    });

    it("Manager created called", () => {
        testStore = configureStore({}, [testExtension]);
        expect(testExtension.onModuleManagerCreated).toHaveBeenCalled();
    });

    it("OnModule Added called", () => {
        testStore = configureStore({}, [testExtension]);
        testStore.addModule({ id: "new_module" });
        expect(testExtension.onModuleAdded).toHaveBeenCalled();
    });

    it("OnModule Removed called", () => {
        testStore = configureStore({}, [testExtension]);
        const module = testStore.addModule({ id: "new_module" });
        module.remove();

        expect(testExtension.onModuleRemoved).toHaveBeenCalled();
    });
});