## What is it?
**redux-dynamic-modules** is a library that aims to make Redux Reducers easy to modularize and add/remove dynamically. 

## Motivation
In large React/Redux applications, oftentimes you will have portions of your state that serve distinct purposes. For example, you might have a reducer and saga that manages `LoginState` in your application, or another set that manages `Todos`. These can be split up into a `LoginModule` and a `TodoModule`. 

Modules provide the following benefits:
* They can be easily re-used across the application, or between multiple similar applications.
* They can be added/removed from the store dynamically, ex. when a component mounts or when a user performs an action

## Features
* Group together reducers, middlware, and state into a single, re-usable module.
* Add and remove modules from a Redux store at any time.
* Use the included `<DynamicModuleLoader />` component to automatically add a module when a component is rendered
* Extensions provide integration with popular libraries, including `redux-saga` and `redux-thunk`

## Examples
See the [Todo App](https://github.com/Microsoft/redux-dynamic-modules/tree/master/packages/todo-example) for a quick of example of the library in practice.

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
