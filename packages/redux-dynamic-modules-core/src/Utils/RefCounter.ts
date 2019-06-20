export interface IRefCounter<T> {
    /**
     * Gets refeerence count for given item
     */
    getCount: (item: T) => number;
    /**
     * Adds given item
     */
    add: (item: T) => void;
    /**
     * Removes the given item
     * @returns true when ref counter reaches zero and item is removed, false otherwise
     */
    remove: (item: T) => boolean;
}

/** Ref counts given object */
export function getObjectRefCounter<T>(
    equals: (a: T, b: T) => boolean,
    retained?: (a: T) => boolean
): IRefCounter<T> {
    if (!equals) {
        equals = (a, b) => a === b;
    }

    if(!retained) {
        retained = () => false;
    }
    const objects: T[] = [];
    const counts: number[] = [];
    return {
        /**
         * Gets ref count of given T
         */
        getCount: (obj: T): number => {
            if (obj === undefined || obj === null) {
                return 0;
            }

            let index = objects.findIndex(o => o && equals(o, obj));
            if (index === -1) {
                return 0;
            }
            return counts[index];
        },
        /**
         * Add given T or increments ref count
         */
        add: (obj: T): void => {
            if (obj === undefined || obj === null) {
                return;
            }

            let index = objects.findIndex(o => o && equals(o, obj));
            let count = 1;
            if (index === -1) {
                index = objects.length;
                objects.push(obj);
            } else {
                count = counts[index] + 1;
            }

            // If item is retained then keep it for inifinty
            if (retained(obj)) {
                count = Infinity;
            }
            
            counts[index] = count;
        },
        /**
         * Decreases ref count for given T, if refcount reaches to zero removes the T and returns true
         */
        remove: (obj: T): boolean => {
            if (retained(obj)) {
                return false;
            }
            
            let index = objects.findIndex(o => o && equals(o, obj));
            if (index === -1) {
                return false;
            }

            if (counts[index] === 1) {
                delete objects[index];
                delete counts[index];
                return true;
            }

            counts[index] = counts[index] - 1;
            return false;
        },
    };
}

/**
 * Ref counts strings
 */
export function getStringRefCounter(): IRefCounter<string> {
    const values: { [key: string]: number } = {};
    return {
        /**
         * Returns current ref count for the key
         */
        getCount: (key: string): number => {
            if (key === undefined || key === null) {
                return 0;
            }

            return values[key] || 0;
        },
        /**
         * Adds given key for ref counting or increments ref count
         */
        add: (key: string): void => {
            if (key === undefined || key === null) {
                return;
            }

            if (!values[key]) {
                values[key] = 1;
            } else {
                values[key]++;
            }
        },
        /**
         * Decreases ref count for the given key, if the ref count reaches 0 removes the key and returns true
         */
        remove: (key: string): boolean => {
            if (key === undefined || key === null) {
                return false;
            }

            if (!values[key]) {
                return false;
            }

            if (values[key] === 1) {
                delete values[key];
                return true;
            }

            values[key]--;
            return false;
        },
    };
}
