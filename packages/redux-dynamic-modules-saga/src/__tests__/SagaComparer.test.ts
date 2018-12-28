import { sagaEquals } from "../SagaComparer";

it("Saga comparer tests", () => {
    expect(sagaEquals(null, null)).toBe(true);
    expect(sagaEquals(func1 as any, func1 as any)).toBe(true);
    expect(sagaEquals(saga1, saga1)).toBe(true);
    expect(
        sagaEquals(
            {
                saga: sagaWithArgs,
                argument: "abc",
            },
            {
                saga: sagaWithArgs,
                argument: "abc",
            }
        )
    ).toBe(true);

    expect(sagaEquals(undefined, null)).toBe(false);
    expect(sagaEquals(null, func1 as any)).toBe(false);
    expect(sagaEquals(func1 as any, saga1)).toBe(false);
    expect(
        sagaEquals(
            {
                saga: sagaWithArgs,
                argument: "abc",
            },
            {
                saga: sagaWithArgs,
                argument: "pqr",
            }
        )
    ).toBe(false);
});

function func1() {}

function* saga1() {}

function* sagaWithArgs(name: string) {}
