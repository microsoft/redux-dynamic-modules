import { flatten } from "../../Utils/Flatten";

describe("Flatten tests", () => {
    it("Null", () => {
        expect(flatten(null)).toBe(null);
        expect(flatten(undefined)).toBe(undefined);
    });

    it("Single level array", () => {
        expect(flatten([])).toEqual([]);
        expect(flatten([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
    });

    it("Double level array", () => {
        expect(flatten([1, [2, 3], 4])).toEqual([1, 2, 3, 4]);
        expect(flatten([[1, 2, 3], 4])).toEqual([1, 2, 3, 4]);
        expect(flatten([[1, 2, 3, 4]])).toEqual([1, 2, 3, 4]);
        expect(flatten([[1], [2], [3], [4]])).toEqual([1, 2, 3, 4]);
    });

    it("Triple level array", () => {
        expect(flatten([1, [[2], 3], 4])).toEqual([1, 2, 3, 4]);
        expect(flatten([[[1, 2], 3], 4])).toEqual([1, 2, 3, 4]);
        expect(flatten([[1, 2, [3, 4]]])).toEqual([1, 2, 3, 4]);
        expect(flatten([[[1]], [[2]], [[3]], [[4]]])).toEqual([1, 2, 3, 4]);
    });
});
