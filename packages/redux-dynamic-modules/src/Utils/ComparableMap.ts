export interface IMap<K, V> {
    keys: K[];
    get(key: K): V;
    add(key: K, value: V): void;
    remove(key: K): V;
}

/**
 * We will use it where we can not use the default Map as the Map class do not allow custom compare function
 * @param equals Optional, a comparer to use
 */
export function getMap<K, V>(
    equals: (key1: K, key2: K) => boolean
): IMap<K, V> {
    const keys: K[] = [];
    const values: { [key: number]: V } = {};

    return {
        /**
         * Current set of keys
         */
        keys,
        /**
         * Gets value for given key
         */
        get: (key: K) => {
            if (!key) {
                return undefined;
            }

            const index = keys.findIndex(k => k && equals(k, key));
            if (index === -1) {
                return undefined;
            }
            return values[index];
        },
        /**
         * Adds the given key and value
         */
        add: (key: K, value: V) => {
            if (!key) {
                return;
            }
            const index = keys.findIndex(k => k && equals(k, key));
            if (index === -1) {
                keys.push(key);
                values[keys.length - 1] = value;
            }
        },
        /**
         * Removes the given key and returns the value object if key was found
         */
        remove: (key: K): V => {
            if (!key) {
                return undefined;
            }
            const index = keys.findIndex(k => k && equals(k, key));
            if (index === -1) {
                return undefined;
            }
            delete keys[index];
            const value = values[index];
            delete values[index];
            return value;
        },
    };
}
