import { SnappableProps, DraggableProps, RotatableProps, MoveableManagerInterface } from "../../types";
export declare function getInnerBoundInfo(moveable: MoveableManagerInterface<SnappableProps>, lines: number[][][], center: number[], datas: any): {
    sign: number[];
    isBound: boolean;
    isVerticalBound: boolean;
    isHorizontalBound: boolean;
    isSnap: boolean;
    offset: number[];
}[];
export declare function getInnerBoundDragInfo(moveable: MoveableManagerInterface<SnappableProps & DraggableProps, any>, poses: number[][], datas: any): {
    vertical: {
        isBound: boolean;
        offset: number;
    };
    horizontal: {
        isBound: boolean;
        offset: number;
    };
};
export declare function getCheckSnapLineDirections(direction: number[], keepRatio: boolean): number[][][];
export declare function getCheckInnerBoundLines(poses: number[][], direction: number[], keepRatio: boolean): number[][][];
export declare function checkRotateInnerBounds(moveable: MoveableManagerInterface<SnappableProps & RotatableProps, any>, prevPoses: number[][], nextPoses: number[][], origin: number[], rotation: number): number[];
export declare function checkInnerBoundPoses(moveable: MoveableManagerInterface<SnappableProps>): {
    horizontal: number[];
    vertical: number[];
};
