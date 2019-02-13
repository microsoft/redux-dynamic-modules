import AddItem from "./AddItem";
import React from "react";
import { DynamicModuleLoader } from "redux-dynamic-modules-react";
import VisibleItemsList from "./VisibleItemsList";
import Footer from "../../components/shoppinglist/Footer";
import { getShoppingListModule } from "../../modules/shoppinglist/shoppingListModule";

const ShoppingListView = () => (
    <DynamicModuleLoader modules={[getShoppingListModule()]}>
        <div>Shopping list view</div>
        <AddItem />
        <VisibleItemsList />
        <Footer />
    </DynamicModuleLoader>
);

export default ShoppingListView;
