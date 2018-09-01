import { ISagaRegistration, ISagaWithArguments } from "../Contracts";
export function equals(a: ISagaRegistration<any>, b: ISagaRegistration<any>): boolean {
    if (typeof a === "function" && typeof b === "function") {
        return a === b;
    }

    if (!a || !b) {
        return a === b;
    }

    if (typeof a === "function") {
        const sagaA = a as () => Iterator<any>;
        const sagaB = b as ISagaWithArguments<any>;
        return sagaA === sagaB.saga && !sagaB.argument;

    } else if (typeof b === "function") {
        const sagaA = a as ISagaWithArguments<any>;
        const sagaB = b as () => Iterator<any>;

        return sagaA.saga === sagaB && !sagaA.argument;
    } else {
        // both are objects
        const sagaA = a as ISagaWithArguments<any>;
        const sagaB = b as ISagaWithArguments<any>;

        return sagaA.saga === sagaB.saga && (
            sagaA.argument === sagaB.argument // TODO: This needs to be a deep equals
        );
    }
}
