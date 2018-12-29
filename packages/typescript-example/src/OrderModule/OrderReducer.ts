import { IOrderState, IOrder } from "./OrderContracts";
import produce from "immer";
import { OrderActionTypes, OrderActionsUnion } from "./OrderActions";

export function orderReducer(
    state: IOrderState,
    action: OrderActionsUnion
): IOrderState {
    return produce(state || {}, draft => {
        switch (action.type) {
            case OrderActionTypes.AddOrder: {
                state.order = action.payload.order;
                break;
            }
        }
    });
}
