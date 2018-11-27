// createStore allows us to load/unload modules dynamically.
import { createStore } from "redux-dynamic-modules";
// Saga extension allows us to use Saga middleware in the module store.
import { getSagaExtension } from "redux-dynamic-modules-saga";
// Thunk extension allows us to use Thunk middleware in the module store.
import { getThunkExtension } from "redux-dynamic-modules-thunk";