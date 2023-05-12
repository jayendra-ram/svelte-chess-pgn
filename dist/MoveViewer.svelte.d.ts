/** @typedef {typeof __propDef.props}  MoveViewerProps */
/** @typedef {typeof __propDef.events}  MoveViewerEvents */
/** @typedef {typeof __propDef.slots}  MoveViewerSlots */
export default class MoveViewer extends SvelteComponentTyped<{
    handleMove: any;
    handleUndo: any;
    handleRedo: any;
    currentIndex: any;
    history?: any[] | undefined;
}, {
    [evt: string]: CustomEvent<any>;
}, {}> {
}
export type MoveViewerProps = typeof __propDef.props;
export type MoveViewerEvents = typeof __propDef.events;
export type MoveViewerSlots = typeof __propDef.slots;
import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        handleMove: any;
        handleUndo: any;
        handleRedo: any;
        currentIndex: any;
        history?: any[] | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export {};
