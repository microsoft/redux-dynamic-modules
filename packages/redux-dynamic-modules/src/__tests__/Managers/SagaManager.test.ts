import { getSagaManager } from '../../Managers/SagaManager';
function getSagaMiddleware(callback) {
    return {
        run: () => {
            return {
                cancel: callback
            }
        }
    };
}

it("saga manager tests", () => {
    let index = 0;
    const taskCancelCallback = () => index++;
    const sagaMiddleware = getSagaMiddleware(taskCancelCallback);

    const sagaManager = getSagaManager(sagaMiddleware as any);

    // Add remove saga and ensure that callback is called after remove
    sagaManager.add([saga1]);
    expect(index).toBe(0);
    sagaManager.remove([saga1]);
    expect(index).toBe(1);

    // Try removing the same saga again and ensure that the task is not cancelled again
    sagaManager.remove([saga1]);
    expect(index).toBe(1);
});

function* saga1() {

}
