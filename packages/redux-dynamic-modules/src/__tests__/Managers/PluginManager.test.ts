// import { getPluginManager, END_TYPE } from "../../Managers/PluginManager";
// import { IModuleStore, IModule } from "../../Contracts";
// import { configureStore } from "../../ModuleStore";
// import { Registry } from "../../Utils/Registry";
// import { Action } from "redux";

// it("plugin manager tests", async (done) => {
//     type state = { id: number };
//     const module: IModule<state> = { id: "dummy" };
//     const pluginRegistry = new Registry<(takeChannel: Channel<any>, putChannel: Channel<any>) => IModule<any>>();
//     let messageFromHost = false;
//     let channelProcessSagaStarted = false;
//     const pluginSaga = function* (args: { takeChannel: Channel<Action>, putChannel: Channel<Action> }) {
//         const {
//             takeChannel,
//             putChannel
//         } = args;
//         channelProcessSagaStarted = true;
//         while (true) {
//             const message = yield effects.take(takeChannel);
//             if (message.type === END_TYPE) {
//                 hostEndMessage = true;
//                 break;
//             }

//             if (message.type === "hostmessage") {
//                 messageFromHost = true;

//                 // put a message to channel after receiving one from host
//                 yield putChannel.put({ type: "fromplugin" });
//             }
//         }
//     }
//     pluginRegistry.register("plugin1",
//         (hostChannel: Channel<any>, pluginChannel: Channel<any>) => {
//             return { id: "plugin1", sagas: [{ saga: pluginSaga, argument: { takeChannel: hostChannel, putChannel: pluginChannel } }] };
//         });

//     // define mock process message to process the message from plugin to host 
//     let messageFromPlugin = false;
//     let hostEndMessage = false;
//     let pluginEndMessage = false;
//     const processMessageFromPlugin = (pluginId: string, message: Action) => {
//         if (message.type === "fromplugin" && pluginId === "plugin1") {
//             messageFromPlugin = true;
//         }

//         if (message.type === END_TYPE) {
//             pluginEndMessage = true;
//         }
//     };
//     const moduleStore: IModuleStore<state> = configureStore({ id: 10 }, [], module);
//     const dispatched = [];

//     const pluginManager = getPluginManager(moduleStore, pluginRegistry, ["plugin1"], processMessageFromPlugin);
//     const storeInterface = {
//         dispatch: (action) => dispatched.push(action),
//         getState: () => ({ value: 'test' })
//     };

//     await runSaga(storeInterface, pluginManager.startInitialPlugins);

//     // validate that the plugin is added to the store
//     expect(channelProcessSagaStarted).toBe(true);
//     await runSaga(storeInterface, pluginManager.postMessage, "plugin1", { type: "hostmessage" })
//         .done;

//     expect(messageFromHost).toBe(true);
//     expect(messageFromPlugin).toBe(true);
//     await runSaga(storeInterface, pluginManager.dispose).done;
//     expect(hostEndMessage).toBe(true);
//     expect(pluginEndMessage).toBe(true);

//     done();

// });
