import { Able, DefaultProps } from "../types";
export declare function makeAble<Name extends string, AbleObject extends Partial<Able<any, any>>, Props extends DefaultProps<Name, AbleObject>>(name: Name, able: AbleObject): {
    readonly events: {};
    readonly props: Props;
    readonly name: Name;
} & AbleObject;
