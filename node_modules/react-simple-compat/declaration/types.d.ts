export interface CompatElement {
    type: any;
    key: any;
    ref: () => any;
    props: {
        children: Array<string | CompatElement>;
        [key: string]: any;
    };
}
