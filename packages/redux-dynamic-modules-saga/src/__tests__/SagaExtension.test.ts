import { createStore } from 'redux-dynamic-modules';
import { getSagaExtension } from '../SagaExtension';
import { ISagaModule } from '../Contracts';
import { SagaIterator } from 'redux-saga';
describe('Saga extension tests', () => {
    it('Saga extension registers module and starts saga', () => {
        const testContext = {};
        called = false;
        createStore({}, [], [getSagaExtension(testContext)], getTestModule());
        expect(called).toEqual(true);
        expect(testContext['moduleManager']).toBeTruthy();
    });

    it('Saga extension registers module and starts saga with context provided', () => {
        const testContext = {};
        called = false;
        const options = true;
        createStore(
            {},
            [],
            [getSagaExtension(testContext, null, options)],
            getTestModuleWithOptions()
        );
        expect(called).toEqual(true);
        expect(testContext['moduleManager']).toBeTruthy();
    });

    it('Saga extension registers module and starts saga with context provided and saga argument', () => {
        const testContext = {};
        called = false;
        calledB = false;

        const options = null;
        createStore(
            {},
            [],
            [getSagaExtension(testContext, null, options)],
            getTestModuleWithArgumentAndOptions()
        );
        expect(called).toEqual(true);
        expect(calledB).toEqual(null);
        // expect(calledB).toEqual(null);
        expect(testContext['moduleManager']).toBeTruthy();
    });
});

let called = false;
let calledB = false;
function* testSaga(): SagaIterator {
    called = true;
}

function* testSagaContext(value?: any): SagaIterator {
    called = value;
}

function* testSagaOptionsWithArgument(
    argument?: any,
    value?: any
): SagaIterator {
    called = argument;
    calledB = value;
}

function getTestModule(): ISagaModule<{ a: string }> {
    return {
        id: 'test-module',
        sagas: [testSaga],
    };
}

function getTestModuleWithOptions(): ISagaModule<{ a: string }> {
    return {
        id: 'test-module-options',
        sagas: [testSagaContext],
    };
}

function getTestModuleWithArgumentAndOptions(): ISagaModule<{ a: string }> {
    return {
        id: 'test-module-options-argument',
        sagas: [
            {
                saga: testSagaOptionsWithArgument,
                argument: true,
            },
        ],
    };
}
