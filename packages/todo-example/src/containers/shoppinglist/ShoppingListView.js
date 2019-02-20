import AddItem from "./AddItem";
import React from "react";
import { useModules } from "redux-dynamic-modules";
import VisibleItemsList from "./VisibleItemsList";
import Footer from "../../components/shoppinglist/Footer";
import { getShoppingListModule } from "../../modules/shoppinglist/shoppingListModule";

const ShoppingListView = () => {
    useModules([getShoppingListModule()]);
    return (
        <div>
            <div>Shopping list view</div>
            <AddItem />
            <VisibleItemsList />
            <Footer />
        </div>
    );
};

export default ShoppingListView;
