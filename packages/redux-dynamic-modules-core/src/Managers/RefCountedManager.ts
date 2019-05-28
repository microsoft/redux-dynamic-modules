import { getObjectRefCounter } from "../Utils/RefCounter";
import { IItemManager } from "../Contracts";

/**
 * Enhances the given items with ref counting for add remove purposes
 */
export function getRefCountedManager<IType extends IItemManager<T>, T>(
    manager: IType,
	equals: (a: T, b: T) => boolean,
	retained?: (a: T) => boolean // Decides if the item is retained even when the ref count reaches 0 
): IType {
	let refCounter = getObjectRefCounter<T>(equals, retained);
    const items = manager.getItems();
    // Set initial ref counting
    items.forEach(item => refCounter.add(item));

    const ret: IType = { ...(manager as object) } as IType;

    // Wrap add method
    ret.add = (items: T[]) => {
        if (!items) {
            return;
        }

        const nonNullItems = items.filter(i => i);
        const notAddedItems = nonNullItems.filter(
            i => refCounter.getCount(i) === 0
        );
        manager.add(notAddedItems);
        nonNullItems.forEach(refCounter.add);
    };

    // Wrap remove
    ret.remove = (items: T[]) => {
        if (!items) {
            return;
        }
        items.forEach(item => {
            if (item) {
                refCounter.remove(item);
                if (refCounter.getCount(item) === 0) {
                    manager.remove([item]);
                }
            }
        });
    };

    ret.dispose = () => {
        manager.dispose();
    };

    return ret;
}
