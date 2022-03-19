import { InjectOptions } from "./types";
export declare function getHash(str: string): any;
export declare function getShadowRoot(parentElement: HTMLElement | SVGElement): Node;
export declare function replaceStyle(className: string, css: string, options: Partial<InjectOptions>): string;
export declare function injectStyle(className: string, css: string, options: Partial<InjectOptions>, shadowRoot?: Node): HTMLStyleElement;
