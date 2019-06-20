import { createStore } from "../ModuleStore";
import { IModuleTuple, IModule } from "../Contracts";

describe("Module Store tests", () => {
    const addedModules = [];
    const testReducer = (state, action) => {
        if (action.type === "@@Internal/ModuleManager/ModuleAdded") {
            addedModules.push(action.payload);
        }

        return null;
    };

    const testModule: IModule<any> = {
        id: "test",
        reducerMap: {
            a: testReducer,
        },
    };

    it("Flattens modules", () => {
        const store = createStore({}, testModule);

        const nestedModules: IModuleTuple = [
            { id: "1" },
            { id: "2" },
            [{ id: "2" }, { id: "3" }],
            [{ id: "4" }, { id: "5" }, { id: "6" }],
        ];

        store.addModules(nestedModules);

        expect(addedModules.length).toBe(7);
        expect(addedModules.slice(1)).toEqual(["1", "2", "3", "4", "5", "6"]);
    });
});
