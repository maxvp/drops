import { Able } from "./types";
import { InitialMoveable } from "./InitialMoveable";
export declare function makeMoveable<T = {}>(ables: Array<Able<T>>): typeof InitialMoveable & (new (...args: any[]) => InitialMoveable<T>);
