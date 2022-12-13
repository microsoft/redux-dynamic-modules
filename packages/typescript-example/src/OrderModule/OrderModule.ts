import { SettingsModule } from "../SettingsModule/SettingsModule";
import { orderReducer } from "./OrderReducer";
import { IModule } from "redux-dynamic-modules";
import { IOrderReducerState } from "./OrderContracts";

const _orderModule: IModule<IOrderReducerState> = {
    id: "order",
    reducerMap: {
        orderState: orderReducer,
    },
};

// The order is important, it says that settings module need to be loaded before the order module
export const OrderModules = [SettingsModule, _orderModule];
