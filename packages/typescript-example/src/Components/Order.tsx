import * as React from "react";
import { connect } from "react-redux";
import { DynamicModuleLoader, StringMap } from "redux-dynamic-modules";
import { OrderModules } from "../OrderModule/OrderModule";
import { IOrder, IOrderModuleState } from "../OrderModule/OrderContracts";
import { getUserPreferences } from "../SettingsModule/SettingsSelectors";
import { SettingActions } from "../SettingsModule/SettingsActions";
import { OrderActions } from "../OrderModule/OrderActions"
import { ItemType } from "../OrderModule/OrderEnums"

interface IOrderProps {
    addOrder: (order: IOrder) => void;
    userPreferences: StringMap<string | boolean>;
    setPreferences: (preferences: StringMap<string | boolean>) => void;
}

const Order = (props: IOrderProps) => {
    const toppings = ["Cheese", "Onion", "Pineapple"];

    const activeToppings = toppings.filter(topping => !!props.userPreferences[topping])
    return (
        <>
            <div>Order</div>
            <ul>
                {toppings.map(t => (
                    <ToppingCheckbox
                        key={"check-" + t}
                        name={t}
                        orderProps={props}
                    />
                ))}
            </ul>
          <button onClick={() => props.addOrder({itemType: ItemType.Pasta, toppings: activeToppings})}>Place Order</button>
        </>
    );
};

interface IToppingCheckboxProps {
    name: string;
    orderProps: IOrderProps;
}

const ToppingCheckbox = (props: IToppingCheckboxProps) => {
    const { orderProps, name } = props;
    const checked = !!orderProps.userPreferences[name];
    const onChange = () => {
        orderProps.setPreferences({
            [name]: !checked,
        });
    };
    return (
        <div>
            <input
                type="checkbox"
                id={name}
                checked={checked}
                onChange={onChange}
                name={name}
            />{" "}
            {name}
        </div>
    );
};

const mapStateToProps = (state: IOrderModuleState) => {
    return {
        userPreferences: getUserPreferences(state),
    };
};

const ConnectedOrder = connect(
    mapStateToProps,
    {
      ...OrderActions,
      ...SettingActions
    }
)(Order);

export const DynamicOrder = () => (
    <DynamicModuleLoader modules={[OrderModules]}>
        <ConnectedOrder />{" "}
    </DynamicModuleLoader>
);
