import { ScrollableProps, MoveableManagerInterface, MoveableGroupInterface } from "../types";
declare const _default: {
    name: string;
    canPinch: boolean;
    props: {
        readonly scrollable: BooleanConstructor;
        readonly scrollContainer: ObjectConstructor;
        readonly scrollThreshold: NumberConstructor;
        readonly getScrollPosition: FunctionConstructor;
    };
    events: {
        readonly onScroll: "scroll";
        readonly onScrollGroup: "scrollGroup";
    };
    dragStart(moveable: MoveableManagerInterface<ScrollableProps>, e: any): void;
    checkScroll(moveable: MoveableManagerInterface<ScrollableProps>, e: any): true | undefined;
    drag(moveable: MoveableManagerInterface<ScrollableProps>, e: any): true | undefined;
    dragEnd(moveable: MoveableManagerInterface<ScrollableProps>, e: any): void;
    dragControlStart(moveable: MoveableManagerInterface<ScrollableProps>, e: any): void;
    dragControl(moveable: MoveableManagerInterface<ScrollableProps>, e: any): true | undefined;
    dragControlEnd(moveable: MoveableManagerInterface<ScrollableProps>, e: any): void;
    dragGroupStart(moveable: MoveableGroupInterface, e: any): void;
    dragGroup(moveable: MoveableGroupInterface, e: any): true | undefined;
    dragGroupEnd(moveable: MoveableGroupInterface, e: any): void;
    dragGroupControlStart(moveable: MoveableGroupInterface, e: any): void;
    dragGroupContro(moveable: MoveableGroupInterface, e: any): true | undefined;
    dragGroupControEnd(moveable: MoveableGroupInterface, e: any): void;
};
export default _default;
