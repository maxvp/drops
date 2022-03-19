import { Able, MoveableManagerInterface } from "./types";
export default class EventManager {
    private target;
    private moveable;
    private eventName;
    private ables;
    constructor(target: HTMLElement | SVGElement | null, moveable: MoveableManagerInterface | null, eventName: string);
    setAbles(ables: Able[]): void;
    onEvent: (e: Event) => void;
    destroy(): void;
}
