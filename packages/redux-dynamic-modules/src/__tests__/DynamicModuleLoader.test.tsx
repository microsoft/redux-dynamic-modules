import { createStore } from "../ModuleStore";
import * as React from "react";
import { Provider, connect } from "react-redux";
import * as ReactTestUtils from "react-dom/test-utils";
import { DynamicModuleLoader } from "../DynamicModuleLoader";

function testMapStateToProps(state) {
    expect(state.foo).toBeTruthy();
    return { foo: state.foo };
}

const TestComponent = connect(testMapStateToProps)(props => (
    <div className="testOutput">{JSON.stringify(props)}</div>
));

describe("DynamicModuleLoader tests", () => {
    let store;
    let testModule;
    beforeEach(() => {
        store = createStore({}, [], []);

        testModule = {
            id: "test",
            reducerMap: {
                foo: () => {
                    return { bar: "testState" };
                },
            },
        };
    });

    it("Works in normal mode", () => {
        const renderedComponent = ReactTestUtils.renderIntoDocument(
            <Provider store={store}>
                <DynamicModuleLoader modules={[testModule]}>
                    <TestComponent />
                </DynamicModuleLoader>
            </Provider>
        );

        expect(renderedComponent).toBeTruthy();

        const output = ReactTestUtils.findRenderedDOMComponentWithClass(
            renderedComponent as React.Component<any>,
            "testOutput"
        );

        expect(output.innerHTML).toContain("testState");
    });

    it("Works in strict mode", () => {
        const renderedComponent = ReactTestUtils.renderIntoDocument(
            <Provider store={store}>
                <DynamicModuleLoader modules={[testModule]} strictMode={true}>
                    <TestComponent />
                </DynamicModuleLoader>
            </Provider>
        );

        expect(renderedComponent).toBeTruthy();

        const output = ReactTestUtils.findRenderedDOMComponentWithClass(
            renderedComponent as React.Component<any>,
            "testOutput"
        );

        expect(output.innerHTML).toContain("testState");
    });
});
