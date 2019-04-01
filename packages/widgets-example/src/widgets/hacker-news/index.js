import { ConnectedHackerNews } from "./component/hacker-news-component";
import { getHackerNewsModule } from "./redux/hacker-news-module";
import { DynamicModuleLoader } from "redux-dynamic-modules-react";
import * as React from "react";

export default function DynamicHackerNews() {
    return (
        // define the module dependency for the HackerNews component
        // DynamicModuleLoader is a HOC provided by redux-dynamic-modules-react
        // It loads the module on ComponentDidMount and unloads on ComponentDidUnmount
        <DynamicModuleLoader modules={[getHackerNewsModule()]}>
            {/* 
                This is the Hacker News component that is connected to the redux store,
                the connected component need not know anything about modules. 
            */}
            <ConnectedHackerNews />
        </DynamicModuleLoader>
    );
}
