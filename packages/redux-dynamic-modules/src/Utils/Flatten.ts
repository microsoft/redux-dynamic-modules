export function flatten(arr: any[]) {
    const res = arr.slice();
    let i = 0;

    while (i < res.length) {
        if (Array.isArray(res[i])) {
            res.splice(i, 1, ...res[i]);
        }
        else {
            i++;
        }
    }

    return res;
}