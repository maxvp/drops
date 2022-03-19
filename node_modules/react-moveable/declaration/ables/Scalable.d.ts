import { directionCondition } from "../utils";
import { ScalableProps, ResizableProps, OnScaleGroup, Renderer, OnScaleGroupStart, DraggableProps, SnappableState, GroupableProps, OnScaleStart, OnScale, MoveableManagerInterface, MoveableGroupInterface } from "../types";
import { IObject } from "@daybrush/utils";
declare const _default: {
    name: string;
    ableGroup: string;
    canPinch: boolean;
    props: {
        readonly scalable: BooleanConstructor;
        readonly throttleScale: NumberConstructor;
        readonly renderDirections: StringConstructor;
        readonly keepRatio: BooleanConstructor;
    };
    events: {
        readonly onScaleStart: "scaleStart";
        readonly onScale: "scale";
        readonly onScaleEnd: "scaleEnd";
        readonly onScaleGroupStart: "scaleGroupStart";
        readonly onScaleGroup: "scaleGroup";
        readonly onScaleGroupEnd: "scaleGroupEnd";
    };
    render(moveable: MoveableManagerInterface<Partial<ResizableProps & ScalableProps>>, React: Renderer): any[] | undefined;
    dragControlCondition: typeof directionCondition;
    dragControlStart(moveable: MoveableManagerInterface<ScalableProps & DraggableProps, SnappableState>, e: any): false | OnScaleStart;
    dragControl(moveable: MoveableManagerInterface<ScalableProps & DraggableProps & GroupableProps, SnappableState>, e: any): false | OnScale;
    dragControlEnd(moveable: MoveableManagerInterface<ScalableProps>, e: any): any;
    dragGroupControlCondition: typeof directionCondition;
    dragGroupControlStart(moveable: MoveableGroupInterface<any, any>, e: any): false | OnScaleGroupStart;
    dragGroupControl(moveable: MoveableGroupInterface<any, any>, e: any): OnScaleGroup | undefined;
    dragGroupControlEnd(moveable: MoveableGroupInterface<any, any>, e: any): any;
    request(): {
        isControl: boolean;
        requestStart(e: IObject<any>): {
            datas: {};
            parentDirection: any;
        };
        request(e: IObject<any>): {
            datas: {};
            parentDist: number[];
        };
        requestEnd(): {
            datas: {};
            isDrag: boolean;
        };
    };
};
export default _default;
