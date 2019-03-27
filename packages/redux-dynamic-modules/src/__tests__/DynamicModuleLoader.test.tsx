import { createStore } from "../ModuleStore";
import * as React from "react";
import { Provider, connect } from "react-redux";
import * as ReactTestUtils from "react-dom/test-utils";
import { DynamicModuleLoader } from "../DynamicModuleLoader";

function testMapStateToProps(state) {
    return { foo: state.foo || "not found" };
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
        class TestHarness extends React.Component<{}, { useDML: boolean }> {
            constructor(props: {}) {
                super(props);
                this.state = { useDML: true };
            }

            render() {
                return (
                    <React.StrictMode>
                        <Provider store={store}>
                            {this.state.useDML ? (
                                <DynamicModuleLoader
                                    modules={[testModule]}
                                    strictMode={true}>
                                    <TestComponent />
                                </DynamicModuleLoader>
                            ) : (
                                <TestComponent />
                            )}
                        </Provider>
                        <button
                            className="toggle"
                            onClick={() =>
                                this.setState({ useDML: !this.state.useDML })
                            }
                        />
                    </React.StrictMode>
                );
            }
        }
        const renderedComponent = ReactTestUtils.renderIntoDocument(
            <TestHarness />
        );

        expect(renderedComponent).toBeTruthy();

        let output = ReactTestUtils.findRenderedDOMComponentWithClass(
            renderedComponent as React.Component<any>,
            "testOutput"
        );

        const button = ReactTestUtils.findRenderedDOMComponentWithClass(
            renderedComponent as React.Component<any>,
            "toggle"
        );

        ReactTestUtils.Simulate.click(button);

        output = ReactTestUtils.findRenderedDOMComponentWithClass(
            renderedComponent as React.Component<any>,
            "testOutput"
        );

        expect(output.innerHTML).toContain("not found");
    });
});
