import { equals } from "../../Utils/SagaComparer";

it("Saga comparer tests", () => {

    expect(equals(null, null)).toBe(true);
    expect(equals(func1 as any, func1 as any)).toBe(true);
    expect(equals(saga1, saga1)).toBe(true);
    expect(equals(
        {
            saga: sagaWithArgs,
            argument: "abc"
        },
        {
            saga: sagaWithArgs,
            argument: "abc"
        })).toBe(true);


    expect(equals(undefined, null)).toBe(false);
    expect(equals(null, func1 as any)).toBe(false);
    expect(equals(func1 as any, saga1)).toBe(false);
    expect(equals(
        {
            saga: sagaWithArgs,
            argument: "abc"
        },
        {
            saga: sagaWithArgs,
            argument: "pqr"
        })).toBe(false);
});

function func1() {

}

function* saga1() {

}

function* sagaWithArgs(name: string) {

}