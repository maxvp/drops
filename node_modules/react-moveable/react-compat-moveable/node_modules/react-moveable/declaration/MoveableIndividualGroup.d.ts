/// <reference types="react" />
import MoveableManager from "./MoveableManager";
import { GroupableProps, RectInfo } from "./types";
declare class MoveableIndividualGroup extends MoveableManager<GroupableProps> {
    moveables: MoveableManager[];
    render(): JSX.Element;
    componentDidUpdate(): void;
    updateRect(type?: "Start" | "" | "End", isTarget?: boolean, isSetState?: boolean): void;
    getRect(): RectInfo;
    request(): {
        request(): any;
        requestEnd(): any;
    };
    dragStart(): this;
    hitTest(): number;
    isInside(): boolean;
    isDragging(): boolean;
    updateRenderPoses(): void;
    updateEvent(): void;
    checkUpdate(): void;
    triggerEvent(): void;
    protected updateAbles(): void;
}
export default MoveableIndividualGroup;
