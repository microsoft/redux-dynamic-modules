import { getSettingsModule } from "../SettingsModule/SettingsModule";
import { orderReducer } from "./OrderReducer";

export function getOrderModules() {
    // The order is important, it says that settings module need to be loaded before the order module
    return [
        getSettingsModule(),
        {
            id: "order",
            reducerMap: {
                orderState: orderReducer,
            },
        },
    ] as any;
}
