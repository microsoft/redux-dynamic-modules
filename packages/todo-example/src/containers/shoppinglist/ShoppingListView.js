import AddItem from "./AddItem";
import React from "react";
import { DynamicModuleLoader } from "redux-dynamic-modules";
import VisibleItemsList from "./VisibleItemsList";
import Footer from "../../components/shoppinglist/Footer";
import { getShoppingListModule } from "../../modules/shoppinglist/shoppingListModule";

const ShoppingListView = () => {
    return (
        <DynamicModuleLoader modules={[getShoppingListModule()]}>
            <div>
                <div>Shopping list view</div>
                <AddItem />
                <VisibleItemsList />
                <Footer />
            </div>
        </DynamicModuleLoader>
    );
};

export default ShoppingListView;
