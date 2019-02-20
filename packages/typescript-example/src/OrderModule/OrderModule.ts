import { SettingsModule } from "../SettingsModule/SettingsModule";
import { orderReducer } from "./OrderReducer";
import { IModule } from "redux-dynamic-modules";
import { IOrderAwareState } from "./OrderContracts";

const _orderModule: IModule<IOrderAwareState> = {
    id: "order",
    reducerMap: {
        orderState: orderReducer,
    } as any,
};

// The order is important, it says that settings module need to be loaded before the order module
export const OrderModules = [SettingsModule, _orderModule];
