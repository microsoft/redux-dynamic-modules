// import { IModule, IModuleManager } from "../Contracts";
// import { Registry } from "../Utils/Registry";
// import { channel, Channel, effects, SagaIterator } from 'redux-saga';
// /**
//  * WHAT IS A PLUGIN?
//  * A plugin is a contributable part of your workflow. Plugins are First Party only.
//  * The plugin and the host communicate via posting messages to each other using Channels.
//  * Every experience can export a PluginRegistry where the plugins can be registered.
//  * The host can send messages to given plugin using the manager, and can recieve messages from plugin in a callback.
//  * The Plugins get two Channels one for receiving messages and other for sending them.
//  * 
//  * The biggest diffrentiator of a Plugin vs a module loaded in the store is the communication.
//  * The plugin coomunicates with the host using Channels rather than Actions thus avoiding unnecessary reducer/selectors invocations.
//  */


// export const END_TYPE = "CHANNEL_IS_ENDED";

// export interface IPluginManager<hostMessageType> {
//     startInitialPlugins: () => SagaIterator;
//     stopPlugin: (pluginId: string) => SagaIterator;
//     startPlugin: (pluginId: string) => SagaIterator;
//     isStarted: (plugInId: string) => boolean;
//     dispose: () => SagaIterator;
//     postMessage: (pluginId: string, message: hostMessageType) => SagaIterator;
// }

// /**
//  * Returns the plugin manager
//  * @param moduleManager Module manager to add the plugin modules so they can participate in redux flow
//  * @param pluginRegistry Registry containing the plugins (host puts to hostChannel, and plugin puts to plugin channel)
//  * @param initialPlugins Ids of initial plugins to load
//  * @param processMessageFromPlugin This will be called when plugin sends a message to the host
//  */
// export function getPluginManager<hostMessageType, pluginMessageType>(
//     moduleManager: IModuleManager,
//     pluginRegistry: Registry<(takeChannel: Channel<hostMessageType>, putChannel: Channel<pluginMessageType>) => IModule<any>>,
//     initialPlugins: string[],
//     processMessageFromPlugin: (pluginId: string, message: pluginMessageType) => void
// ): IPluginManager<hostMessageType> {

//     // create a channel registry to manage the channels
//     const channelRegistry = new Registry<Channel<hostMessageType & pluginMessageType>>();

//     // these will hold the stop function for each plugin
//     const stoppers: { [pluginid: string]: () => void } = {};

//     const startPlugin = function* (pluginId: string) {
//         if (pluginRegistry.isRegistered(pluginId) && !stoppers[pluginId]) {

//             // register a channel for the plugin
//             const hostChannel: Channel<any> = yield effects.call(channel);
//             const pluginChannel: Channel<any> = yield effects.call(channel);

//             // start listening to messages on the channel for given plugin
//             const listener = yield effects.fork(processPluginMessages, pluginId, pluginChannel, processMessageFromPlugin);

//             // register the channel for the plugin in the registry
//             yield effects.call(channelRegistry.register, pluginId + "-host", hostChannel);
//             yield effects.call(channelRegistry.register, pluginId, pluginChannel);

//             // get the plugin module
//             const moduleFactory = pluginRegistry.get(pluginId);

//             // pass the channel to moduleFactory for the plugin to get the module
//             // the factory can create a new module with a saga that has the channel as parameter
//             // and start the saga when module is added to the store
//             const mdle = moduleFactory(hostChannel, pluginChannel);

//             // add the module, the module should start the saga with the channel parameter.
//             // the saga should start listening to the channel we registered
//             // it can also put messages into it for host to process
//             const moduleRemover = yield effects.call([moduleManager, moduleManager.addModule], mdle);

//             stoppers[pluginId] = function* () {
//                 // put the end message to the channel so all listners can exit
//                 yield hostChannel.put({ type: END_TYPE });
//                 yield pluginChannel.put({ type: END_TYPE });

//                 // remove the module
//                 yield effects.call([moduleRemover, moduleRemover.remove]);

//                 // remove the channel from the registry
//                 yield effects.call([channelRegistry, channelRegistry.unregister], pluginId);
//                 yield effects.call([channelRegistry, channelRegistry.unregister], pluginId + "-host");

//                 // cancel the listener
//                 yield effects.cancel(listener);
//             }
//         }
//     }

//     const stopPlugin = function* (pluginId: string) {
//         if (stoppers[pluginId]) {
//             yield effects.call(stoppers[pluginId]);
//             delete stoppers[pluginId];
//         }
//     }

//     return {
//         startInitialPlugins: function* () {
//             // start the initial plugins
//             for (const pluginId of initialPlugins) {
//                 yield effects.fork(startPlugin, pluginId);
//             }
//         },
//         isStarted: (pluginId: string) => {
//             return !!stoppers[pluginId];
//         },
//         startPlugin,
//         stopPlugin,
//         /** uses for posting the message to the plugin */
//         postMessage: function* (pluginId: string, message: hostMessageType) {
//             if (channelRegistry.isRegistered(pluginId)) {
//                 const hostChannel = yield effects.call([channelRegistry, channelRegistry.get], pluginId + "-host");
//                 yield hostChannel.put(message);
//             }
//         },
//         dispose: function* () {
//             const registeredPlugins = Object.keys(stoppers);
//             for (const pluginId of registeredPlugins) {
//                 yield effects.call(stopPlugin, pluginId);
//             }
//         }
//     }
// }

// function* processPluginMessages<messageType>(
//     pluginId: string,
//     pluginChannel: Channel<messageType>,
//     processMessageFromPluginChannel: (pluginId: string, message: messageType) => void
// ): SagaIterator {
//     while (true) {
//         const message: messageType = yield effects.take(pluginChannel);
//         // stop listening the channel if END message is received        
//         yield effects.call(processMessageFromPluginChannel, pluginId, message);

//         if (message["type"] === END_TYPE) {
//             break;
//         }
//     }
// }
