import AddItem from './AddItem';
import React from 'react';
import { DynamicModuleLoader } from 'redux-dynamic-modules';
import VisibleItemsList from './VisibleItemsList';
import Footer from '../../components/shoppinglist/Footer';
import { getShoppingListModule } from '../../modules/shoppinglist/shoppingListModule';

class ShoppingListView extends React.Component {
  render() {
      return (
      <DynamicModuleLoader modules={[getShoppingListModule()]}>
        <AddItem />
        <VisibleItemsList />
        <Footer />
      </DynamicModuleLoader>
      )
  }
}

export default ShoppingListView
