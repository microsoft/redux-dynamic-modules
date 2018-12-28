import { getMap } from "../../Utils/ComparableMap";

it("comparable map tests", () => {
    const equals = (a, b) => a === b;
    const map = getMap(equals);

    map.add(1, 2);
    map.add(2, 3);

    expect(map.get(1)).toBe(2);
    expect(map.remove(1)).toBe(2);
    expect(map.remove(1)).toBe(undefined);
    expect(map.remove(2)).toBe(3);
});
