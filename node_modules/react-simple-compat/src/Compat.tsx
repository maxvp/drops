import { diff } from "@egjs/list-differ";
import { IObject, isUndefined, isString, isArray, decamelize, isNumber } from "@daybrush/utils";
import { CompatElement } from "./types";

function isDiff(a: object, b: object) {
    if (a === b) { return false; }
    for (const i in a) {
        if (!(i in b)) {
            return true;
        }
    }
    for (const i in b) {
        if (a[i] !== b[i]) {
            return true;
        }
    }
    return false;
}
function diffObject(a: object, b: object) {
    const keys1 = Object.keys(a);
    const keys2 = Object.keys(b);

    const result = diff(keys1, keys2, key => key);

    const added: IObject<any> = {};
    const removed: IObject<any> = {};
    const changed: IObject<any> = {};

    result.added.forEach(index => {
        const name = keys2[index];

        added[name] = b[name];
    });
    result.removed.forEach(index => {
        const name = keys1[index];

        removed[name] = a[name];
    });
    result.maintained.forEach(([index]) => {
        const name = keys1[index];
        const values = [a[name], b[name]];

        if (a[name] !== b[name]) {
            changed[name] = values;
        }
    });
    return {
        added,
        removed,
        changed,
    };
}
function executeHooks(hooks: Function[]) {
    hooks.forEach(hook => {
        hook();
    });
}
function fillKeys(keys: any[]): string[] {
    let index = 0;

    return keys.map(key => key == null ? `$compat${++index}` : `${key}`);
}
function createProvider(el: CompatElement | string, key: string, index: number, container?: Provider) {
    if (isString(el) || isNumber(el)) {
        return new TextProvider(`text_${el}`, key, index, container, null, {});
    }
    const providerClass
        = typeof el.type === "string"
            ? ElementProvider
            : el.type.prototype.render
                ? ComponentProvider
                : FunctionProvider;

    return new providerClass(
        el.type,
        key,
        index,
        container,
        el.ref,
        el.props,
    );
}
function flat(arr: any[]) {
    let arr2 = [];

    arr.forEach(el => {
        arr2 = arr2.concat(isArray(el) ? flat(el) : el);
    });

    return arr2;
}
function getAttributes(props: IObject<any>) {
    const { className, ...otherProps } = props;

    if (className != null) {
        otherProps.class = className;
    }
    delete otherProps.style;
    delete otherProps.children;
    return otherProps;
}
function fillProps(props: IObject<any>, defaultProps: IObject<any>) {
    if (!defaultProps) {
        return props;
    }
    for (const name in defaultProps) {
        if (isUndefined(props[name])) {
            props[name] = defaultProps[name];
        }
    }
    return props;
}
export function createElement(
    type: any,
    props: any,
    ...children: any[]
): CompatElement {
    const { key, ref, ...otherProps } = props || {};

    return {
        type,
        key,
        ref,
        props: { ...otherProps, children: flat(children).filter(child => child != null && child !== false) },
    };
}
abstract class Provider<T extends Element | Component | Node = Element | Component | Node> {
    public original: CompatElement | string;
    public base: T;
    public _providers: Array<Provider<any>> = [];
    constructor(
        public type: any,
        public key: string,
        public index: number,
        public container?: Provider | null,
        public ref?: (e: Element | Component | Node) => any,
        public props: IObject<any> = {},
    ) { }
    public abstract _render(hooks: Function[], prevProps: any, nextState: any);
    public abstract _unmount();
    public _should(nextProps: any, nextState: any): boolean {
        return true;
    }
    public _update(
        hooks: Function[],
        nextElement: CompatElement | string,
        nextState?: any,
        isForceUpdate?: boolean,
    ) {
        if (
            this.base
            && !isString(nextElement)
            && !isForceUpdate
            && !this._should(nextElement.props, nextState)
        ) {
            return false;
        }
        this.original = nextElement;
        this._setState(nextState);
        // render
        const prevProps = this.props;

        if (!isString(nextElement)) {
            this.props = nextElement.props;
            this.ref = nextElement.ref;
        }
        this._render(hooks, this.base ? prevProps : {}, nextState);
        return true;
    }
    public _mounted() {
        const ref = this.ref;
        ref && ref(this.base);
    }
    public _setState(nextstate: IObject<any>) {
        return;
    }
    public _updated() {
        const ref = this.ref;
        ref && ref(this.base);
    }
    public _destroy() {
        const ref = this.ref;
        ref && ref(null);
    }
}
function diffAttributes(attrs1: IObject<any>, attrs2: IObject<any>, el: Element) {
    const { added, removed, changed } = diffObject(attrs1, attrs2);
    for (const name in added) {
        el.setAttribute(name, added[name]);
    }
    for (const name in changed) {
        el.setAttribute(name, changed[name][1]);
    }
    for (const name in removed) {
        el.removeAttribute(name);
    }
}
function diffEvents(
    events1: IObject<any>,
    events2: IObject<any>,
    provier: ElementProvider,
) {
    const { added, removed, changed } = diffObject(events1, events2);

    for (const name in removed) {
        provier.removeEventListener(name);
    }
    for (const name in added) {
        provier.addEventListener(name, added[name]);
    }
    for (const name in changed) {
        provier.removeEventListener(name);
        provier.addEventListener(name, changed[name][1]);
    }
    for (const name in removed) {
        provier.removeEventListener(name);
    }
}
function diffStyle(style1: IObject<any>, style2: IObject<any>, el: HTMLElement | SVGElement) {
    const style = el.style;
    const { added, removed, changed } = diffObject(style1, style2);

    for (const beforeName in added) {
        const name = decamelize(beforeName, "-");

        if (style.setProperty) {
            style.setProperty(name, added[beforeName]);
        } else {
            style[name] = added[beforeName];
        }
    }
    for (const beforeName in changed) {
        const name = decamelize(beforeName, "-");

        if (style.setProperty) {
            style.setProperty(name, changed[beforeName][1]);
        } else {
            style[name] = changed[beforeName][1];
        }
    }
    for (const beforeName in removed) {
        const name = decamelize(beforeName, "-");

        if (style.removeProperty) {
            style.removeProperty(name);
        } else {
            style[name] = "";
        }
    }
}
function splitProps(props: IObject<any>) {
    const attributes = {};
    const events = {};

    for (const name in props) {
        if (name.indexOf("on") === 0) {
            events[name.replace("on", "").toLowerCase()] = props[name];
        } else {
            attributes[name] = props[name];
        }
    }
    return {
        attributes,
        events,
    };
}
class TextProvider extends Provider<Node> {
    public _render(hooks: Function[]) {
        const isMount = !this.base;

        if (isMount) {
            this.base = document.createTextNode(this.type.replace("text_", ""));
        }
        hooks.push(() => {
            if (isMount) {
                this._mounted();
            } else {
                this._updated();
            }
        });
        return true;
    }
    public _unmount() {
        this.base.parentNode.removeChild(this.base);
    }
}
class ElementProvider extends Provider<Element> {
    public events: IObject<Function> = {};
    public _isSVG = false;

    public addEventListener(name, callback) {
        const events = this.events;

        events[name] = e => {
            e.nativeEvent = e;
            callback(e);
        };
        this.base.addEventListener(name, events[name] as any);
    }
    public removeEventListener(name) {
        const events = this.events;

        this.base.removeEventListener(name, events[name] as any);

        delete events[name];
    }
    public _should(nextProps: any) {
        return isDiff(this.props, nextProps);
    }
    public _render(hooks: Function[], prevProps: any) {
        const isMount = !this.base;

        if (isMount) {
            const isSVG = this._hasSVG();

            this._isSVG = isSVG;

            let element = this.props.portalContainer;

            if (!element) {
                const type = this.type;
                if (isSVG) {
                    element = document.createElementNS("http://www.w3.org/2000/svg", type);
                } else {
                    element = document.createElement(type);
                }
            }
            this.base = element;
        }
        renderProviders(this, this._providers, this.props.children, hooks, null);
        const base = this.base;

        const {
            attributes: prevAttributes,
            events: prevEvents,
        } = splitProps(prevProps);
        const {
            attributes: nextAttributes,
            events: nextEvents,
        } = splitProps(this.props);
        diffAttributes(
            getAttributes(prevAttributes),
            getAttributes(nextAttributes),
            base,
        );
        diffEvents(
            prevEvents,
            nextEvents,
            this,
        );
        diffStyle(
            prevProps.style || {},
            this.props.style || {},
            base as HTMLElement,
        );
        hooks.push(() => {
            if (isMount) {
                this._mounted();
            } else {
                this._updated();
            }
        });
        return true;
    }
    public _unmount() {
        const events = this.events;
        const base = this.base;

        for (const name in events) {
            base.removeEventListener(name, events[name] as any);
        }
        this._providers.forEach(provider => {
            provider._unmount();
        });
        this.events = {};

        if (!this.props.portalContainer) {
            base.parentNode.removeChild(base);
        }
    }
    private _hasSVG() {
        if (this._isSVG || this.type === "svg") {
            return true;
        }
        const containerNode = findContainerNode(this.container);

        return containerNode && "ownerSVGElement" in containerNode;
    }
}
function findContainerNode(provider: Provider): Node | null {
    if (!provider) {
        return null;
    }
    const base = provider.base;
    if (base instanceof Node) {
        return base;
    }
    return findContainerNode(provider.container);
}
export function findDOMNode(comp: Component | Node | null): Node | null {
    if (!comp) {
        return null;
    }
    if (comp instanceof Node) {
        return comp;
    }
    const providers = comp.$_provider._providers;
    if (!providers.length) {
        return null;
    }
    return findDOMNode(providers[0].base);
}
class FunctionProvider extends Provider<Component> {
    public _render(hooks: Function[]) {
        const template = this.type(this.props);

        renderProviders(this, this._providers, template ? [template] : [], hooks);
        return true;
    }
    public _unmount() {
        this._providers.forEach(provider => {
            provider._unmount();
        });
    }
}
class ContainerProvider extends Provider<any> {
    constructor(base: Element) {
        super("container", "container", 0, null);
        this.base = base;
    }
    public _render() {
        return true;
    }
    public _unmount() {
        return;
    }
}
class ComponentProvider extends Provider<Component> {
    constructor(
        type: typeof Component,
        key: string,
        index: number,
        container: Provider | null,
        ref: (e: Element | Component | Node) => any,
        props: IObject<any> = {},
    ) {
        super(type, key, index, container, ref, fillProps(props, type.defaultProps));
    }
    public _should(nextProps: any, nextState: any) {
        return this.base.shouldComponentUpdate(
            fillProps(nextProps, this.type.defaultProps),
            nextState || this.base.state,
        );
    }
    public _render(hooks: Function[], prevProps, nextState) {
        this.props = fillProps(this.props, this.type.defaultProps);
        const isMount = !this.base;

        if (isMount) {
            this.base = new this.type(this.props);
            this.base.$_provider = this;
        } else {
            this.base.props = this.props;
        }
        const base = this.base;
        const prevState = base.state;
        const template = base.render();

        if (template && template.props && !template.props.children.length) {
            template.props.children = this.props.children;
        }
        renderProviders(
            this,
            this._providers,
            template ? [template] : [],
            hooks,
            nextState,
            null,
        );
        hooks.push(() => {
            if (isMount) {
                this._mounted();
                base.componentDidMount();
            } else {
                this._updated();
                base.componentDidUpdate(prevProps, prevState);
            }
        });
    }
    public _setState(nextState?: IObject<any>) {
        const base = this.base;

        if (!base || !nextState) {
            return;
        }
        base.state = nextState;
    }
    public _unmount() {
        this._providers.forEach(provider => {
            provider._unmount();
        });
        clearTimeout(this.base.$_timer);
        this.base.componentWillUnmount();
    }
}
export class Component {
    public static defaultProps?: IObject<any>;
    public state: IObject<any> = {};
    public $_provider: ComponentProvider;
    public $_timer = 0;
    public $_state: IObject<any> = {};

    constructor(public props: IObject<any> = {}) { }
    public shouldComponentUpdate(props?: any, state?: any): boolean {
        return true;
    }
    public render() {
        return null;
    }
    public setState(state: IObject<any>, callback?: Function, isForceUpdate?: boolean) {
        if (!this.$_timer) {
            this.$_state = {};
        }
        clearTimeout(this.$_timer);

        this.$_timer = 0;
        this.$_state = {...this.$_state, ...state};

        if (!isForceUpdate) {
            this.$_timer = setTimeout(() => {
                this.$_timer = 0;
                this.$_setState(callback, isForceUpdate);
            });
        } else {
            this.$_setState(callback, isForceUpdate);
        }
        return;
    }
    public forceUpdate(callback?: Function) {
        this.setState({}, callback, true);
    }
    public componentDidMount() { }
    public componentDidUpdate(prevProps, prevState) { }
    public componentWillUnmount() { }
    private $_setState(callback?: Function, isForceUpdate?: boolean) {
        const hooks: Function[] = [];
        const provider = this.$_provider;
        const isUpdate = renderProviders(
            provider.container,
            [provider],
            [provider.original],
            hooks,
            { ...this.state, ...this.$_state },
            isForceUpdate,
        );
        if (isUpdate) {
            if (callback) {
                hooks.push(callback);
            }
            executeHooks(hooks);
        }
    }
}
export class PureComponent extends Component {
    public shouldComponentUpdate(props?, state?) {
        return isDiff(this.props, props) || isDiff(this.state, state);
    }
}
class _Portal extends PureComponent {
    public _portalProvider: Provider;
    public componentDidMount() {
        const { element, container } = this.props;

        this._portalProvider = new ContainerProvider(container);

        renderProvider(element, container, this._portalProvider);
    }
    public componentDidUpdate() {
        const { element, container } = this.props;

        renderProvider(element, container, this._portalProvider);
    }
    public componentWillUnmount() {
        const { container } = this.props;

        renderProvider(null, container, this._portalProvider);
        this._portalProvider = null;
    }
}
function updateProvider(
    provider: Provider,
    children: Array<CompatElement | string>,
    nextState?: any,
) {
    const hooks: Function[] = [];
    renderProviders(
        provider,
        provider._providers,
        children,
        hooks,
        nextState,
    );
    executeHooks(hooks);
}
function getNextSibiling(
    provider: Provider,
    childProvider: Provider,
) {
    const childProviders = provider._providers;
    const length = childProviders.length;

    for (let i = childProvider.index + 1; i < length; ++i) {
        const el = findDOMNode(childProviders[i].base);

        if (el) {
            return el;
        }
    }
    return null;
}
function diffProviders(
    containerProvider: Provider,
    providers: Provider[],
    children: Array<CompatElement | string>,
) {
    const childrenKeys = children.map(p => isString(p) ? null : p.key);
    const keys1 = fillKeys(providers.map(p => p.key));
    const keys2 = fillKeys(childrenKeys);
    const result = diff(keys1, keys2, key => key);

    result.removed.forEach(index => {
        providers.splice(index, 1)[0]._unmount();
    });
    result.ordered.forEach(([from, to]) => {
        const childrenProvider = providers.splice(from, 1)[0];

        providers.splice(to, 0, childrenProvider);

        const el = findDOMNode(childrenProvider.base);
        const next = findDOMNode(providers[to + 1] && providers[to + 1].base);

        if (el) {
            el.parentNode.insertBefore(el, next);
        }
    });
    result.added.forEach(index => {
        providers.splice(index, 0, createProvider(children[index], childrenKeys[index], index, containerProvider));
    });
    const changed = result.maintained.filter(([_, to]) => {
        const el = children[to];
        const childProvider = providers[to];
        const type = isString(el) ? `text_${el}` : el.type;

        if (type !== childProvider.type) {
            childProvider._unmount();
            providers.splice(to, 1, createProvider(el, childrenKeys[to], to, containerProvider));
            return true;
        }
        childProvider.index = to;
        return false;
    });

    return [
        ...result.added,
        ...changed.map(([_, to]) => to),
    ];
}
function renderProviders(
    containerProvider: Provider | null,
    providers: Provider[],
    children: Array<CompatElement | string>,
    updatedHooks: Function[],
    nextState?: any,
    isForceUpdate?: boolean,
) {
    const result = diffProviders(containerProvider, providers, children);
    const updated = providers.filter((childProvider, i) => {
        return childProvider._update(updatedHooks, children[i], nextState, isForceUpdate);
    });
    const containerNode = findContainerNode(containerProvider);

    if (containerNode) {
        result.reverse().forEach(index => {
            const childProvider = providers[index];
            const el = findDOMNode(childProvider.base);

            if (!el) {
                return;
            }
            if (containerNode !== el && !el.parentNode) {
                const nextElement = getNextSibiling(containerProvider, childProvider);
                containerNode.insertBefore(el, nextElement);
            }
        });
    }
    return updated.length > 0;
}
function renderProvider(
    element: any,
    container: Element,
    provider: Provider = (container as any).__REACT_COMPAT__,
) {
    const isProvider = !!provider;

    if (!provider) {
        provider = new ContainerProvider(container);
    }
    updateProvider(provider, element ? [element] : []);

    if (!isProvider) {
        (container as any).__REACT_COMPAT__ = provider;
    }
    return provider;
}
export function render(element: any, container: Element, callback?: Function) {
    const provider = (container as any).__REACT_COMPAT__;
    if (element && !provider) {
        container.innerHTML = "";
    }
    renderProvider(element, container, provider);
    callback && callback();
}

export function createPortal(el: any, container: Element) {
    return <_Portal element={el} container={container} />;
}

export const version = "simple-1.1.0"
