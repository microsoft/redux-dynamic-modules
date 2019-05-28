import {
    getStringRefCounter,
    getObjectRefCounter,
} from "../../Utils/RefCounter";
it("tests string ref counter", () => {
    const refCounter = getStringRefCounter();
    expect(refCounter.getCount("foobar")).toBe(0);

    refCounter.add("a");
    expect(refCounter.getCount("a")).toBe(1);

    refCounter.add("a");
    expect(refCounter.getCount("a")).toBe(2);

    refCounter.add(undefined);
    expect(refCounter.getCount(undefined)).toBe(0);

    refCounter.add(null);
    expect(refCounter.getCount(null)).toBe(0);

    expect(refCounter.remove("a")).toBe(false);
    expect(refCounter.getCount("a")).toBe(1);

    expect(refCounter.remove("a")).toBe(true);
    expect(refCounter.getCount("a")).toBe(0);

    expect(refCounter.remove("a")).toBe(false);
    expect(refCounter.getCount("a")).toBe(0);
});

it("tests object ref counter", () => {
    const refCounter = getObjectRefCounter<Function>((a, b) => a === b);
    expect(refCounter.getCount(foobar)).toBe(0);

    refCounter.add(a);
    expect(refCounter.getCount(a)).toBe(1);

    refCounter.add(a);
    expect(refCounter.getCount(a)).toBe(2);

    expect(refCounter.remove(a)).toBe(false);
    expect(refCounter.getCount(a)).toBe(1);

    expect(refCounter.remove(a)).toBe(true);
    expect(refCounter.getCount(a)).toBe(0);

    expect(refCounter.remove(a)).toBe(false);
    expect(refCounter.getCount(a)).toBe(0);
});

it("tests object ref counter when objects are retained", () => {
    const refCounter = getObjectRefCounter<Function>((a, b) => a === b, () => true);
    expect(refCounter.getCount(foobar)).toBe(0);

    refCounter.add(a);
    expect(refCounter.getCount(a)).toBe(Infinity);

    refCounter.add(a);
    expect(refCounter.getCount(a)).toBe(Infinity);

    expect(refCounter.remove(a)).toBe(false);
    expect(refCounter.getCount(a)).toBe(Infinity);

    expect(refCounter.remove(a)).toBe(false);
    expect(refCounter.getCount(a)).toBe(Infinity);

    expect(refCounter.remove(a)).toBe(false);
    expect(refCounter.getCount(a)).toBe(Infinity);
});

function foobar() { }

function a() {}
