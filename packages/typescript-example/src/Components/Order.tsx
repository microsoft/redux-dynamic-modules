import * as React from "react";
import { connect } from "react-redux";
import { DynamicModuleLoader } from "redux-dynamic-modules";
import { getOrderModules } from "../OrderModule/OrderModule";
import { IOrderAwareState } from "../OrderModule/OrderContracts";
import { getUserPreferences } from "../SettingsModule/SettingsSelectors";
import { StringMap } from "../ActionHelper";
import { SettingActions } from "../SettingsModule/SettingsActions";

interface IOrderProps {
    userPreferences: StringMap<string | boolean>;
    setPreferences: (preferences: StringMap<string | boolean>) => void;
}

const Order = (props: IOrderProps) => {
    const toppings = ["Cheese", "Onion", "Pineapple"];
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

const mapStateToProps = (state: IOrderAwareState) => {
    return {
        userPreferences: getUserPreferences(state),
    };
};

const ConnectedOrder = connect(
    mapStateToProps,
    SettingActions
)(Order);

export const DynamicOrder = () => (
    <DynamicModuleLoader modules={getOrderModules()}>
        <ConnectedOrder />{" "}
    </DynamicModuleLoader>
);
