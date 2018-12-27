import { ISettingsAwareState } from "../SettingsModule/SettingsContracts";

export enum ItemType {
    Pizza = 0,
    Pasta = 1
}

export interface IOrder {
    itemType: ItemType;
    toppings: string[];
}

export interface IOrderState {
    order?: IOrder;
}

// This is the state for the module, 
// It extends from ISettingsAwareState to indicate that the order module depends on Settings Module from state perspective
// This way any code loading order module can call selectors from both order and settings module
export interface IOrderAwareState extends ISettingsAwareState {
    orderState: IOrderState;
}