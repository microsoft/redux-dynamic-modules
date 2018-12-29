import { getRefCountedManager } from "../../Managers/RefCountedManager";

it("ref counted manager tests", () => {
    const items = new Set(["a", "b"]);
    const manager = {
        getItems: () => Array.from(items.keys()),
        add: (s: string[]) => s.length > 0 && s.forEach(s1 => items.add(s1)),
        remove: (s: string[]) => s.forEach(s1 => items.delete(s1)),
        dispose: () => {},
    };

    const refCounter = getRefCountedManager(manager, (a, b) => a === b);
    expect(refCounter.getItems()).toEqual(["a", "b"]);

    refCounter.add(["a"]);
    expect(refCounter.getItems()).toEqual(["a", "b"]);

    refCounter.add(null);
    expect(refCounter.getItems()).toEqual(["a", "b"]);

    refCounter.add([null]);
    expect(refCounter.getItems()).toEqual(["a", "b"]);

    refCounter.remove(["a"]);
    expect(refCounter.getItems()).toEqual(["a", "b"]);

    refCounter.remove(["a", undefined]);
    expect(refCounter.getItems()).toEqual(["b"]);

    refCounter.add(["c"]);
    expect(refCounter.getItems()).toEqual(["b", "c"]);

    refCounter.remove(["c"]);
    expect(refCounter.getItems()).toEqual(["b"]);
});
