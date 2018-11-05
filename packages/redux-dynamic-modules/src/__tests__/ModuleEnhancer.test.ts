import { moduleEnhancer } from '../ModuleEnhancer';
import {
    createStore,
    compose,
    applyMiddleware
} from 'redux';

it("Validate with applyMiddleware enhancer", () => {
    const store = createStore(
        testReducer,
        compose(
            moduleEnhancer(),
            applyMiddleware(testMiddleware)
        ));

    // validate that the store has addModule
    expect(!!store.addModule).toBe(true);

    // validate that the base enhancer is working
    store.dispatch({ type: "hello world" });
});


const testReducer = (state, action) => {
    if (action.type.indexOf("@") === -1) {
        expect(action.enhanced).toBe("foo");
    }
    return (state || 1) + 1;
}

const testMiddleware = () => {
    return (next) => action => {
        action.enhanced = "foo";
        return next(action);
    }
}