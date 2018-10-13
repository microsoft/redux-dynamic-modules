import { ConnectedHackerNews } from "./component/hacker-news-component";
import { getHackerNewsModule } from "./redux/hacker-news-module";
import { DynamicModuleLoader } from "redux-dynamic-modules";
import * as React from "react";
export default function Dynamic(){
   return (
        <DynamicModuleLoader modules={[getHackerNewsModule()]}>
            <ConnectedHackerNews />
        </DynamicModuleLoader>
   );
}