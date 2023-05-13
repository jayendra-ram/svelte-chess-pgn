/** @typedef {typeof __propDef.props}  BoardProps */
/** @typedef {typeof __propDef.events}  BoardEvents */
/** @typedef {typeof __propDef.slots}  BoardSlots */
export default class Board extends SvelteComponentTyped<{
    startingPositionFEN?: string | undefined;
    pgn?: string | undefined;
    debug?: boolean | undefined;
}, {
    [evt: string]: CustomEvent<any>;
}, {}> {
}
export type BoardProps = typeof __propDef.props;
export type BoardEvents = typeof __propDef.events;
export type BoardSlots = typeof __propDef.slots;
import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        startingPositionFEN?: string | undefined;
        pgn?: string | undefined;
        debug?: boolean | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export {};
