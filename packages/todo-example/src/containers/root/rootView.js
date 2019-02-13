import React from "react";
import { DynamicModuleLoader } from "redux-dynamic-modules-react";
import { getRootModule } from "../../modules/root/rootModule";
import Header from "../../components/root/Header";
import Views from "./Views";

const Rootview = () => (
    <DynamicModuleLoader modules={[getRootModule()]}>
        <Header />
        <Views />
    </DynamicModuleLoader>
);

export default Rootview;
