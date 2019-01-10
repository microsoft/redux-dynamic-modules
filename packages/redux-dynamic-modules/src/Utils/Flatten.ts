export function flatten(arr: any[]) {
    if (arr) {
        const res = arr.slice();
        let i = 0;

        while (i < res.length) {
            if (Array.isArray(res[i])) {
                res.splice(i, 1, ...res[i]);
            } else {
                i++;
            }
        }

        return res;
    }
    return arr;
}
