export class Registry<T> {
    private dict: { [key: string]: T } = {};
    public register = (id: string, object: T) => {
        if (!this.dict[id]) {
            this.dict[id] = object;
        }
    }

    public get = (id: string): T => {
        return this.dict[id];
    }

    public unregister = (id: string): void => {
        delete this.dict[id];
    }

    public isRegistered = (id: string): boolean => {
        return !!this.dict[id];
    }
}
