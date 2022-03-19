/// <reference types="react" />
import { Renderer, MoveableManagerInterface, RenderDirections } from "./types";
export declare function renderDirectionControls(moveable: MoveableManagerInterface<Partial<RenderDirections>>, defaultDirections: string[], React: Renderer, additionalClassName?: string): any[];
export declare function renderLine(React: Renderer, direction: string, pos1: number[], pos2: number[], zoom: number, key: number | string, ...classNames: string[]): JSX.Element;
export declare function renderAllDirections(moveable: MoveableManagerInterface<Partial<RenderDirections>>, React: Renderer): any[];
export declare function renderDiagonalDirections(moveable: MoveableManagerInterface<Partial<RenderDirections>>, React: Renderer): any[];
