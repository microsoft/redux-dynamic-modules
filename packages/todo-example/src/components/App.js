import React from 'react'
import RootView from "../containers/root/rootView"

const App = () => (<div> 
    <RootView />
    <div>
        <div>This app contains two modules</div>
        <div>1) Todo</div>
        <div>2) Shopping list</div>

        <div>By clicking on each button above the modules are loaded and their views are displayed.</div>
        <div>When you switch between them the previous module is unloaded and its state is cleared.</div>
    </div>
</div>)  

export default App
