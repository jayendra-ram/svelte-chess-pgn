/** @typedef {typeof __propDef.props}  PieceProps */
/** @typedef {typeof __propDef.events}  PieceEvents */
/** @typedef {typeof __propDef.slots}  PieceSlots */
export default class Piece extends SvelteComponentTyped<{
    name?: string | undefined;
}, {
    [evt: string]: CustomEvent<any>;
}, {}> {
}
export type PieceProps = typeof __propDef.props;
export type PieceEvents = typeof __propDef.events;
export type PieceSlots = typeof __propDef.slots;
import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        name?: string | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export {};
