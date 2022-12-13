import { IOrderState } from "./OrderContracts";
import produce from "immer";
import { OrderActionTypes, OrderActionsUnion } from "./OrderActions";

export const orderReducer = (
    state: IOrderState | undefined,
    action: OrderActionsUnion
): IOrderState => {
    return produce(state || {}, draft => {
        switch (action.type) {
            case OrderActionTypes.AddOrder: {
                draft.order = action.payload.order;
                break;
            }
        }
    });
}
