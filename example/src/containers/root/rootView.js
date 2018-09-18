import React from 'react';
import { DynamicModuleLoader } from 'redux-dynamic-modules'
import { getRootModule } from '../../modules/root/rootModule';
import Header from '../../components/root/Header';
import Views from "./Views"

class Rootview extends React.Component {
   constructor(props, context) {
     super(props, context);
   }
   render() {
      return (
          <DynamicModuleLoader modules={[getRootModule()]}>
            <Header />
            <Views />
          </DynamicModuleLoader>
        );
      }
}

export default Rootview
