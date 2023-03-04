
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    /**
     * Associates an arbitrary `context` object with the current component and the specified `key`
     * and returns that object. The context is then available to children of the component
     * (including slotted content) with `getContext`.
     *
     * Like lifecycle functions, this must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-setcontext
     */
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    /**
     * Retrieves the context that belongs to the closest parent component with the specified `key`.
     * Must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-getcontext
     */
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.55.1' }, detail), { bubbles: true }));
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    class LayerManager {
        currentLayerId;
        setups;
        renderers;
        dispatchers;
        needsSetup;
        needsResize;
        needsRedraw;
        context;
        width;
        height;
        autoclear;
        pixelRatio;
        renderLoop;
        layerObserver;
        layerRef;
        layerSequence;
        renderingLayerId;
        activeLayerId;
        activeLayerDispatcher;
        constructor() {
            this.register = this.register.bind(this);
            this.unregister = this.unregister.bind(this);
            this.redraw = this.redraw.bind(this);
            this.resize = this.resize.bind(this);
            this.getRenderingLayerId = this.getRenderingLayerId.bind(this);
            this.currentLayerId = 1;
            this.setups = new Map();
            this.renderers = new Map();
            this.dispatchers = new Map();
            this.needsSetup = false;
            this.needsResize = true;
            this.needsRedraw = true;
            this.renderingLayerId = 0;
            this.activeLayerId = 0;
            this.layerSequence = [];
        }
        redraw() {
            this.needsRedraw = true;
        }
        resize() {
            this.needsResize = true;
            this.needsRedraw = true;
        }
        register({ setup, render, dispatcher }) {
            if (setup) {
                this.setups.set(this.currentLayerId, setup);
                this.needsSetup = true;
            }
            this.renderers.set(this.currentLayerId, render);
            this.dispatchers.set(this.currentLayerId, dispatcher);
            this.needsRedraw = true;
            return this.currentLayerId++;
        }
        unregister(layerId) {
            this.renderers.delete(layerId);
            this.dispatchers.delete(layerId);
            this.needsRedraw = true;
        }
        setup(context, layerRef) {
            this.context = context;
            this.layerRef = layerRef;
            this.observeLayerSequence();
            this.startRenderLoop();
        }
        observeLayerSequence() {
            this.layerObserver = new MutationObserver(this.getLayerSequence.bind(this));
            this.layerObserver.observe(this.layerRef, { childList: true });
            this.getLayerSequence();
        }
        getLayerSequence() {
            const layers = [...this.layerRef.children];
            this.layerSequence = layers.map((layer) => +(layer.dataset.layerId ?? -1));
            this.redraw();
        }
        startRenderLoop() {
            this.render();
            this.renderLoop = requestAnimationFrame(() => this.startRenderLoop());
        }
        render() {
            const context = this.context;
            const width = this.width;
            const height = this.height;
            const pixelRatio = this.pixelRatio;
            if (this.needsResize) {
                context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
                this.needsResize = false;
            }
            if (this.needsSetup) {
                for (const [layerId, setup] of this.setups) {
                    setup({ context, width, height });
                    this.setups.delete(layerId);
                }
                this.needsSetup = false;
            }
            if (this.needsRedraw) {
                if (this.autoclear) {
                    context.clearRect(0, 0, width, height);
                }
                for (const layerId of this.layerSequence) {
                    this.renderingLayerId = layerId;
                    this.renderers.get(layerId)?.({ context, width, height });
                }
                this.needsRedraw = false;
            }
        }
        setActiveLayer(layer, e) {
            if (this.activeLayerId === layer)
                return;
            if (e instanceof MouseEvent) {
                this.dispatchLayerEvent(new PointerEvent('pointerleave', e));
                this.dispatchLayerEvent(new MouseEvent('mouseleave', e));
            }
            this.activeLayerId = layer;
            this.activeLayerDispatcher = this.dispatchers.get(layer);
            if (e instanceof MouseEvent) {
                this.dispatchLayerEvent(new PointerEvent('pointerenter', e));
                this.dispatchLayerEvent(new MouseEvent('mouseenter', e));
            }
        }
        dispatchLayerEvent(e) {
            if (!this.activeLayerDispatcher)
                return;
            if (window.TouchEvent && e instanceof TouchEvent) {
                const { left, top } = e.target.getBoundingClientRect();
                const { clientX, clientY } = e.changedTouches[0];
                const detail = {
                    x: clientX - left,
                    y: clientY - top,
                    originalEvent: e
                };
                this.activeLayerDispatcher(e.type, detail);
            }
            else if (e instanceof MouseEvent) {
                const detail = {
                    x: e.offsetX,
                    y: e.offsetY,
                    originalEvent: e
                };
                this.activeLayerDispatcher(e.type, detail);
            }
        }
        getRenderingLayerId() {
            return this.renderingLayerId;
        }
        destroy() {
            if (typeof window === 'undefined')
                return;
            this.layerObserver.disconnect();
            cancelAnimationFrame(this.renderLoop);
        }
    }

    const idToRgb = (id) => {
        const id2 = id * 2;
        const r = (id2 >> 16) & 0xff;
        const g = (id2 >> 8) & 0xff;
        const b = id2 & 0xff;
        return `rgb(${r}, ${g}, ${b})`;
    };
    const rgbToId = (r, g, b) => {
        const id = ((r << 16) | (g << 8) | b) / 2;
        return id % 1 ? 0 : id;
    };

    const EXCLUDED_GETTERS = ['drawImage', 'setTransform'];
    const EXCLUDED_SETTERS = [
        'filter',
        'shadowBlur',
        'globalCompositeOperation',
        'globalAlpha'
    ];
    const COLOR_OVERRIDES = [
        'drawImage',
        'fill',
        'fillRect',
        'fillText',
        'stroke',
        'strokeRect',
        'strokeText'
    ];
    const createContextProxy = (context) => {
        let renderingLayerId;
        const canvas = document.createElement('canvas');
        const proxyContext = canvas.getContext('2d', {
            willReadFrequently: true
        });
        const resizeCanvas = () => {
            const { a: pixelRatio } = context.getTransform();
            canvas.width = context.canvas.width / pixelRatio;
            canvas.height = context.canvas.height / pixelRatio;
        };
        const canvasSizeObserver = new MutationObserver(resizeCanvas);
        canvasSizeObserver.observe(context.canvas, {
            attributeFilter: ['width', 'height']
        });
        resizeCanvas();
        return new Proxy(context, {
            get(target, property) {
                if (property === '_getLayerIdAtPixel') {
                    return (x, y) => {
                        const pixel = proxyContext.getImageData(x, y, 1, 1).data;
                        return rgbToId(pixel[0], pixel[1], pixel[2]);
                    };
                }
                const val = target[property];
                if (typeof val !== 'function')
                    return val;
                return function (...args) {
                    if (property === 'setTransform') {
                        resizeCanvas();
                    }
                    if (COLOR_OVERRIDES.includes(property)) {
                        const layerColor = idToRgb(renderingLayerId());
                        proxyContext.fillStyle = layerColor;
                        proxyContext.strokeStyle = layerColor;
                    }
                    if (property === 'drawImage') {
                        proxyContext.fillRect(...args.slice(1));
                    }
                    if (!EXCLUDED_GETTERS.includes(property)) {
                        Reflect.apply(val, proxyContext, args);
                    }
                    return Reflect.apply(val, target, args);
                };
            },
            set(target, property, newValue) {
                if (property === '_renderingLayerId') {
                    renderingLayerId = newValue;
                    return true;
                }
                target[property] = newValue;
                if (!EXCLUDED_SETTERS.includes(property)) {
                    proxyContext[property] = newValue;
                }
                return true;
            }
        });
    };

    /* node_modules/svelte-canvas/dist/components/Canvas.svelte generated by Svelte v3.55.1 */
    const file$1 = "node_modules/svelte-canvas/dist/components/Canvas.svelte";

    function create_fragment$4(ctx) {
    	let canvas_1;
    	let canvas_1_width_value;
    	let canvas_1_height_value;
    	let style_width = `${/*width*/ ctx[0]}px`;
    	let style_height = `${/*height*/ ctx[1]}px`;
    	let t;
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);

    	const block = {
    		c: function create() {
    			canvas_1 = element("canvas");
    			t = space();
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(canvas_1, "width", canvas_1_width_value = /*width*/ ctx[0] * /*_pixelRatio*/ ctx[5]);
    			attr_dev(canvas_1, "height", canvas_1_height_value = /*height*/ ctx[1] * /*_pixelRatio*/ ctx[5]);
    			attr_dev(canvas_1, "class", /*clazz*/ ctx[4]);
    			attr_dev(canvas_1, "style", /*style*/ ctx[2]);
    			set_style(canvas_1, "display", `block`);
    			set_style(canvas_1, "width", style_width);
    			set_style(canvas_1, "height", style_height);
    			add_location(canvas_1, file$1, 75, 0, 2230);
    			set_style(div, "display", `none`);
    			add_location(div, file$1, 150, 0, 4221);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, canvas_1, anchor);
    			/*canvas_1_binding*/ ctx[64](canvas_1);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[65](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						canvas_1,
    						"touchstart",
    						prevent_default(function () {
    							if (is_function(/*layerEvents*/ ctx[3]
    							? /*handleLayerTouchStart*/ ctx[9]
    							: null)) (/*layerEvents*/ ctx[3]
    							? /*handleLayerTouchStart*/ ctx[9]
    							: null).apply(this, arguments);
    						}),
    						false,
    						true,
    						false
    					),
    					listen_dev(
    						canvas_1,
    						"mousemove",
    						function () {
    							if (is_function(/*layerEvents*/ ctx[3]
    							? /*handleLayerMouseMove*/ ctx[8]
    							: null)) (/*layerEvents*/ ctx[3]
    							? /*handleLayerMouseMove*/ ctx[8]
    							: null).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						canvas_1,
    						"pointermove",
    						function () {
    							if (is_function(/*layerEvents*/ ctx[3]
    							? /*handleLayerMouseMove*/ ctx[8]
    							: null)) (/*layerEvents*/ ctx[3]
    							? /*handleLayerMouseMove*/ ctx[8]
    							: null).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						canvas_1,
    						"click",
    						function () {
    							if (is_function(/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null)) (/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						canvas_1,
    						"contextmenu",
    						function () {
    							if (is_function(/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null)) (/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						canvas_1,
    						"dblclick",
    						function () {
    							if (is_function(/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null)) (/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						canvas_1,
    						"mousedown",
    						function () {
    							if (is_function(/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null)) (/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						canvas_1,
    						"mouseenter",
    						function () {
    							if (is_function(/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null)) (/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						canvas_1,
    						"mouseleave",
    						function () {
    							if (is_function(/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null)) (/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						canvas_1,
    						"mouseup",
    						function () {
    							if (is_function(/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null)) (/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						canvas_1,
    						"wheel",
    						function () {
    							if (is_function(/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null)) (/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						canvas_1,
    						"touchcancel",
    						prevent_default(function () {
    							if (is_function(/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null)) (/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null).apply(this, arguments);
    						}),
    						false,
    						true,
    						false
    					),
    					listen_dev(
    						canvas_1,
    						"touchend",
    						prevent_default(function () {
    							if (is_function(/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null)) (/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null).apply(this, arguments);
    						}),
    						false,
    						true,
    						false
    					),
    					listen_dev(
    						canvas_1,
    						"touchmove",
    						prevent_default(function () {
    							if (is_function(/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null)) (/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null).apply(this, arguments);
    						}),
    						false,
    						true,
    						false
    					),
    					listen_dev(
    						canvas_1,
    						"pointerenter",
    						function () {
    							if (is_function(/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null)) (/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						canvas_1,
    						"pointerleave",
    						function () {
    							if (is_function(/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null)) (/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						canvas_1,
    						"pointerdown",
    						function () {
    							if (is_function(/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null)) (/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						canvas_1,
    						"pointerup",
    						function () {
    							if (is_function(/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null)) (/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						canvas_1,
    						"pointercancel",
    						function () {
    							if (is_function(/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null)) (/*layerEvents*/ ctx[3]
    							? /*handleLayerEvent*/ ctx[10]
    							: null).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(canvas_1, "focus", /*focus_handler*/ ctx[19], false, false, false),
    					listen_dev(canvas_1, "blur", /*blur_handler*/ ctx[20], false, false, false),
    					listen_dev(canvas_1, "fullscreenchange", /*fullscreenchange_handler*/ ctx[21], false, false, false),
    					listen_dev(canvas_1, "fullscreenerror", /*fullscreenerror_handler*/ ctx[22], false, false, false),
    					listen_dev(canvas_1, "scroll", /*scroll_handler*/ ctx[23], false, false, false),
    					listen_dev(canvas_1, "cut", /*cut_handler*/ ctx[24], false, false, false),
    					listen_dev(canvas_1, "copy", /*copy_handler*/ ctx[25], false, false, false),
    					listen_dev(canvas_1, "paste", /*paste_handler*/ ctx[26], false, false, false),
    					listen_dev(canvas_1, "keydown", /*keydown_handler*/ ctx[27], false, false, false),
    					listen_dev(canvas_1, "keypress", /*keypress_handler*/ ctx[28], false, false, false),
    					listen_dev(canvas_1, "keyup", /*keyup_handler*/ ctx[29], false, false, false),
    					listen_dev(canvas_1, "auxclick", /*auxclick_handler*/ ctx[30], false, false, false),
    					listen_dev(canvas_1, "click", /*click_handler*/ ctx[31], false, false, false),
    					listen_dev(canvas_1, "contextmenu", /*contextmenu_handler*/ ctx[32], false, false, false),
    					listen_dev(canvas_1, "dblclick", /*dblclick_handler*/ ctx[33], false, false, false),
    					listen_dev(canvas_1, "mousedown", /*mousedown_handler*/ ctx[34], false, false, false),
    					listen_dev(canvas_1, "mouseenter", /*mouseenter_handler*/ ctx[35], false, false, false),
    					listen_dev(canvas_1, "mouseleave", /*mouseleave_handler*/ ctx[36], false, false, false),
    					listen_dev(canvas_1, "mousemove", /*mousemove_handler*/ ctx[37], false, false, false),
    					listen_dev(canvas_1, "mouseover", /*mouseover_handler*/ ctx[38], false, false, false),
    					listen_dev(canvas_1, "mouseout", /*mouseout_handler*/ ctx[39], false, false, false),
    					listen_dev(canvas_1, "mouseup", /*mouseup_handler*/ ctx[40], false, false, false),
    					listen_dev(canvas_1, "select", /*select_handler*/ ctx[41], false, false, false),
    					listen_dev(canvas_1, "wheel", /*wheel_handler*/ ctx[42], false, false, false),
    					listen_dev(canvas_1, "drag", /*drag_handler*/ ctx[43], false, false, false),
    					listen_dev(canvas_1, "dragend", /*dragend_handler*/ ctx[44], false, false, false),
    					listen_dev(canvas_1, "dragenter", /*dragenter_handler*/ ctx[45], false, false, false),
    					listen_dev(canvas_1, "dragstart", /*dragstart_handler*/ ctx[46], false, false, false),
    					listen_dev(canvas_1, "dragleave", /*dragleave_handler*/ ctx[47], false, false, false),
    					listen_dev(canvas_1, "dragover", /*dragover_handler*/ ctx[48], false, false, false),
    					listen_dev(canvas_1, "drop", /*drop_handler*/ ctx[49], false, false, false),
    					listen_dev(canvas_1, "touchcancel", /*touchcancel_handler*/ ctx[50], false, false, false),
    					listen_dev(canvas_1, "touchend", /*touchend_handler*/ ctx[51], false, false, false),
    					listen_dev(canvas_1, "touchmove", /*touchmove_handler*/ ctx[52], false, false, false),
    					listen_dev(canvas_1, "touchstart", /*touchstart_handler*/ ctx[53], false, false, false),
    					listen_dev(canvas_1, "pointerover", /*pointerover_handler*/ ctx[54], false, false, false),
    					listen_dev(canvas_1, "pointerenter", /*pointerenter_handler*/ ctx[55], false, false, false),
    					listen_dev(canvas_1, "pointerdown", /*pointerdown_handler*/ ctx[56], false, false, false),
    					listen_dev(canvas_1, "pointermove", /*pointermove_handler*/ ctx[57], false, false, false),
    					listen_dev(canvas_1, "pointerup", /*pointerup_handler*/ ctx[58], false, false, false),
    					listen_dev(canvas_1, "pointercancel", /*pointercancel_handler*/ ctx[59], false, false, false),
    					listen_dev(canvas_1, "pointerout", /*pointerout_handler*/ ctx[60], false, false, false),
    					listen_dev(canvas_1, "pointerleave", /*pointerleave_handler*/ ctx[61], false, false, false),
    					listen_dev(canvas_1, "gotpointercapture", /*gotpointercapture_handler*/ ctx[62], false, false, false),
    					listen_dev(canvas_1, "lostpointercapture", /*lostpointercapture_handler*/ ctx[63], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty[0] & /*width, _pixelRatio*/ 33 && canvas_1_width_value !== (canvas_1_width_value = /*width*/ ctx[0] * /*_pixelRatio*/ ctx[5])) {
    				attr_dev(canvas_1, "width", canvas_1_width_value);
    			}

    			if (!current || dirty[0] & /*height, _pixelRatio*/ 34 && canvas_1_height_value !== (canvas_1_height_value = /*height*/ ctx[1] * /*_pixelRatio*/ ctx[5])) {
    				attr_dev(canvas_1, "height", canvas_1_height_value);
    			}

    			if (!current || dirty[0] & /*clazz*/ 16) {
    				attr_dev(canvas_1, "class", /*clazz*/ ctx[4]);
    			}

    			if (!current || dirty[0] & /*style*/ 4) {
    				attr_dev(canvas_1, "style", /*style*/ ctx[2]);
    			}

    			if (dirty[0] & /*width*/ 1 && style_width !== (style_width = `${/*width*/ ctx[0]}px`)) {
    				set_style(canvas_1, "width", style_width);
    			}

    			if (dirty[0] & /*height*/ 2 && style_height !== (style_height = `${/*height*/ ctx[1]}px`)) {
    				set_style(canvas_1, "height", style_height);
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 131072)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[17],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[17])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[17], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(canvas_1);
    			/*canvas_1_binding*/ ctx[64](null);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[65](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const KEY = Symbol();
    const getTypedContext = () => getContext(KEY);

    function instance$4($$self, $$props, $$invalidate) {
    	let _pixelRatio;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Canvas', slots, ['default']);
    	let { width = 640, height = 640, pixelRatio = null, style = '', autoclear = true, layerEvents = false } = $$props;
    	let { class: clazz = '' } = $$props;
    	let canvas;
    	let context = null;
    	let layerRef;
    	const manager = new LayerManager();

    	function redraw() {
    		manager.redraw();
    	}

    	function getCanvas() {
    		return canvas;
    	}

    	function getContext$1() {
    		return context;
    	}

    	if (pixelRatio === undefined || pixelRatio === null) {
    		if (typeof window !== 'undefined') {
    			pixelRatio = window.devicePixelRatio;
    		} else {
    			pixelRatio = 2;
    		}
    	}

    	setContext(KEY, {
    		register: manager.register,
    		unregister: manager.unregister,
    		redraw: manager.redraw
    	});

    	onMount(() => {
    		const ctx = canvas.getContext('2d');

    		if (layerEvents) {
    			context = createContextProxy(ctx);
    			context._renderingLayerId = manager.getRenderingLayerId;
    		} else {
    			context = ctx;
    		}

    		manager.setup(context, layerRef);
    	});

    	onDestroy(() => manager.destroy());

    	const handleLayerMouseMove = e => {
    		const { offsetX: x, offsetY: y } = e;
    		const id = context._getLayerIdAtPixel(x, y);
    		manager.setActiveLayer(id, e);
    		manager.dispatchLayerEvent(e);
    	};

    	const handleLayerTouchStart = e => {
    		const { clientX: x, clientY: y } = e.changedTouches[0];
    		const { left, top } = canvas.getBoundingClientRect();
    		const id = context._getLayerIdAtPixel(x - left, y - top);
    		manager.setActiveLayer(id, e);
    		manager.dispatchLayerEvent(e);
    	};

    	const handleLayerEvent = e => {
    		if (window.TouchEvent && e instanceof TouchEvent) e.preventDefault();
    		manager.dispatchLayerEvent(e);
    	};

    	const writable_props = ['width', 'height', 'pixelRatio', 'style', 'autoclear', 'layerEvents', 'class'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Canvas> was created with unknown prop '${key}'`);
    	});

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function fullscreenchange_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function fullscreenerror_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function scroll_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function cut_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function copy_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function paste_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function auxclick_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function contextmenu_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function dblclick_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mousedown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mousemove_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseout_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function select_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function wheel_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function drag_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function dragend_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function dragenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function dragstart_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function dragleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function dragover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function drop_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function touchcancel_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function touchend_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function touchmove_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function touchstart_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function pointerover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function pointerenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function pointerdown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function pointermove_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function pointerup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function pointercancel_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function pointerout_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function pointerleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function gotpointercapture_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function lostpointercapture_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function canvas_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			canvas = $$value;
    			$$invalidate(6, canvas);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			layerRef = $$value;
    			$$invalidate(7, layerRef);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('pixelRatio' in $$props) $$invalidate(11, pixelRatio = $$props.pixelRatio);
    		if ('style' in $$props) $$invalidate(2, style = $$props.style);
    		if ('autoclear' in $$props) $$invalidate(12, autoclear = $$props.autoclear);
    		if ('layerEvents' in $$props) $$invalidate(3, layerEvents = $$props.layerEvents);
    		if ('class' in $$props) $$invalidate(4, clazz = $$props.class);
    		if ('$$scope' in $$props) $$invalidate(17, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		LayerManager,
    		getCTX: getContext,
    		KEY,
    		getTypedContext,
    		createContextProxy,
    		onMount,
    		onDestroy,
    		setContext,
    		width,
    		height,
    		pixelRatio,
    		style,
    		autoclear,
    		layerEvents,
    		clazz,
    		canvas,
    		context,
    		layerRef,
    		manager,
    		redraw,
    		getCanvas,
    		getContext: getContext$1,
    		handleLayerMouseMove,
    		handleLayerTouchStart,
    		handleLayerEvent,
    		_pixelRatio
    	});

    	$$self.$inject_state = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('pixelRatio' in $$props) $$invalidate(11, pixelRatio = $$props.pixelRatio);
    		if ('style' in $$props) $$invalidate(2, style = $$props.style);
    		if ('autoclear' in $$props) $$invalidate(12, autoclear = $$props.autoclear);
    		if ('layerEvents' in $$props) $$invalidate(3, layerEvents = $$props.layerEvents);
    		if ('clazz' in $$props) $$invalidate(4, clazz = $$props.clazz);
    		if ('canvas' in $$props) $$invalidate(6, canvas = $$props.canvas);
    		if ('context' in $$props) context = $$props.context;
    		if ('layerRef' in $$props) $$invalidate(7, layerRef = $$props.layerRef);
    		if ('_pixelRatio' in $$props) $$invalidate(5, _pixelRatio = $$props._pixelRatio);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*pixelRatio*/ 2048) {
    			$$invalidate(5, _pixelRatio = pixelRatio ?? 1);
    		}

    		if ($$self.$$.dirty[0] & /*width*/ 1) {
    			$$invalidate(16, manager.width = width, manager);
    		}

    		if ($$self.$$.dirty[0] & /*height*/ 2) {
    			$$invalidate(16, manager.height = height, manager);
    		}

    		if ($$self.$$.dirty[0] & /*_pixelRatio*/ 32) {
    			$$invalidate(16, manager.pixelRatio = _pixelRatio, manager);
    		}

    		if ($$self.$$.dirty[0] & /*autoclear*/ 4096) {
    			$$invalidate(16, manager.autoclear = autoclear, manager);
    		}

    		if ($$self.$$.dirty[0] & /*width, height, pixelRatio, autoclear, manager*/ 71683) {
    			(manager.resize());
    		}
    	};

    	return [
    		width,
    		height,
    		style,
    		layerEvents,
    		clazz,
    		_pixelRatio,
    		canvas,
    		layerRef,
    		handleLayerMouseMove,
    		handleLayerTouchStart,
    		handleLayerEvent,
    		pixelRatio,
    		autoclear,
    		redraw,
    		getCanvas,
    		getContext$1,
    		manager,
    		$$scope,
    		slots,
    		focus_handler,
    		blur_handler,
    		fullscreenchange_handler,
    		fullscreenerror_handler,
    		scroll_handler,
    		cut_handler,
    		copy_handler,
    		paste_handler,
    		keydown_handler,
    		keypress_handler,
    		keyup_handler,
    		auxclick_handler,
    		click_handler,
    		contextmenu_handler,
    		dblclick_handler,
    		mousedown_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		mousemove_handler,
    		mouseover_handler,
    		mouseout_handler,
    		mouseup_handler,
    		select_handler,
    		wheel_handler,
    		drag_handler,
    		dragend_handler,
    		dragenter_handler,
    		dragstart_handler,
    		dragleave_handler,
    		dragover_handler,
    		drop_handler,
    		touchcancel_handler,
    		touchend_handler,
    		touchmove_handler,
    		touchstart_handler,
    		pointerover_handler,
    		pointerenter_handler,
    		pointerdown_handler,
    		pointermove_handler,
    		pointerup_handler,
    		pointercancel_handler,
    		pointerout_handler,
    		pointerleave_handler,
    		gotpointercapture_handler,
    		lostpointercapture_handler,
    		canvas_1_binding,
    		div_binding
    	];
    }

    class Canvas extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$4,
    			create_fragment$4,
    			safe_not_equal,
    			{
    				width: 0,
    				height: 1,
    				pixelRatio: 11,
    				style: 2,
    				autoclear: 12,
    				layerEvents: 3,
    				class: 4,
    				redraw: 13,
    				getCanvas: 14,
    				getContext: 15
    			},
    			null,
    			[-1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Canvas",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get width() {
    		throw new Error("<Canvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Canvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Canvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Canvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pixelRatio() {
    		throw new Error("<Canvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pixelRatio(value) {
    		throw new Error("<Canvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Canvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Canvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autoclear() {
    		throw new Error("<Canvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autoclear(value) {
    		throw new Error("<Canvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get layerEvents() {
    		throw new Error("<Canvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set layerEvents(value) {
    		throw new Error("<Canvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Canvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Canvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get redraw() {
    		return this.$$.ctx[13];
    	}

    	set redraw(value) {
    		throw new Error("<Canvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getCanvas() {
    		return this.$$.ctx[14];
    	}

    	set getCanvas(value) {
    		throw new Error("<Canvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getContext() {
    		return this.$$.ctx[15];
    	}

    	set getContext(value) {
    		throw new Error("<Canvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-canvas/dist/components/Layer.svelte generated by Svelte v3.55.1 */
    const file = "node_modules/svelte-canvas/dist/components/Layer.svelte";

    function create_fragment$3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "data-layer-id", /*layerId*/ ctx[0]);
    			add_location(div, file, 11, 0, 416);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Layer', slots, []);
    	const { register, unregister, redraw } = getTypedContext();
    	const dispatcher = createEventDispatcher();
    	let { setup = undefined } = $$props;
    	let { render = () => undefined } = $$props;
    	const layerId = register({ setup, render, dispatcher });
    	onDestroy(() => unregister(layerId));
    	const writable_props = ['setup', 'render'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Layer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('setup' in $$props) $$invalidate(1, setup = $$props.setup);
    		if ('render' in $$props) $$invalidate(2, render = $$props.render);
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		createEventDispatcher,
    		getTypedContext,
    		register,
    		unregister,
    		redraw,
    		dispatcher,
    		setup,
    		render,
    		layerId
    	});

    	$$self.$inject_state = $$props => {
    		if ('setup' in $$props) $$invalidate(1, setup = $$props.setup);
    		if ('render' in $$props) $$invalidate(2, render = $$props.render);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*render*/ 4) {
    			(redraw());
    		}
    	};

    	return [layerId, setup, render];
    }

    class Layer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { setup: 1, render: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Layer",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get setup() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set setup(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get render() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set render(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const squareSize = 20;

    function FENtoBoard(FEN) {
      let board = FEN.split(" ")[0].split("/");
      board.forEach(function (item, i) {
        board[i] = item.replace(/[1]/, "_");
        board[i] = board[i].replace(/[2]/, "__");
        board[i] = board[i].replace(/[3]/, "___");
        board[i] = board[i].replace(/[4]/, "____");
        board[i] = board[i].replace(/[5]/, "_____");
        board[i] = board[i].replace(/[6]/, "______");
        board[i] = board[i].replace(/[7]/, "_______");
        board[i] = board[i].replace(/[8]/, "________");
      });
      board = board.join("").split("");
      board.forEach(function (item, i) {
        board[i] = [item, Math.floor(i / 8), i % 8];
      });
      return board;
    }

    function pgnToFen(pgnMoves, fen) {
      let board = fen.split(" ")[0];
      let activeColor = fen.split(" ")[1];
      let castleAvailability = fen.split(" ")[2];
      let enPassantTarget = fen.split(" ")[3];
      let halfMoveClock = fen.split(" ")[4];
      let fullMoveNumber = fen.split(" ")[5];

      const pieces = {
        p: "wp",
        n: "wn",
        b: "wb",
        r: "wr",
        q: "wq",
        k: "wk",
        P: "bp",
        N: "bn",
        B: "bb",
        R: "br",
        Q: "bq",
        K: "bk",
      };

      for (const move of pgnMoves.split(" ")) {
        if (!isNaN(parseInt(move[0]))) {
          // This is a move number, skip it
          continue;
        } else if (move === "O-O") {
          // King-side castle
          if (activeColor === "w") {
            board = board.replace("e1", "-k-").replace("h1", "--r-");
          } else {
            board = board.replace("e8", "-k-").replace("h8", "--r-");
          }
          castleAvailability.replace(activeColor, "");
          castleAvailability.replace("-", "");
          if (castleAvailability === "") {
            castleAvailability = "-";
          }
          if (activeColor === "w") {
            activeColor = "b";
          } else {
            activeColor = "w";
            fullMoveNumber++;
          }
        } else if (move === "O-O-O") {
          // Queen-side castle
          if (activeColor === "w") {
            board = board.replace("e1", "-k-").replace("a1", "---r");
          } else {
            board = board.replace("e8", "-k-").replace("a8", "---r");
          }
          castleAvailability.replace(activeColor, "");
          castleAvailability.replace("-", "");
          if (castleAvailability === "") {
            castleAvailability = "-";
          }
          if (activeColor === "w") {
            activeColor = "b";
            fullMoveNumber++;
          } else {
            activeColor = "w";
          }
        } else {
          // Normal move
          const piece = move[0];
          const from = move.substr(1, 2);
          const to = move.substr(3, 2);
          const captured = move.includes("x") ? "x" : "";
          board = board.replace(from, captured + "-").replace(to, pieces[piece]);
          if (piece.toLowerCase() === "p" && Math.abs(to[1] - from[1]) === 2) {
            enPassantTarget = `${from[0]}${
          (parseInt(from[1]) + parseInt(to[1])) / 2
        }`;
          } else {
            enPassantTarget = "-";
          }
          castleAvailability.replace(activeColor, "");
          if (piece.toLowerCase() === "k") {
            castleAvailability.replace("-", "");
          }
          if (castleAvailability === "") {
            castleAvailability = "-";
          }
          if (activeColor === "w") {
            activeColor = "b";
            fullMoveNumber++;
          } else {
            activeColor = "w";
          }
        }
      }
      return `${board} ${activeColor} ${castleAvailability} ${enPassantTarget} ${halfMoveClock} ${fullMoveNumber}`;
    }

    const EXAMPLE_PGN = "1. e4";
    const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    //console.log("yaa")

    //FEN -> pieces,

    //(FEN,PNG command) -> FEN

    const start = "rnbqkbnr".split("");

    let pieces = [0, 1].flatMap((index) => {
      return start
        .map((piece, file) => {
          return [`${piece}`, file, index ? 7 : 0];
        })
        .concat(start.map((_, file) => [`P`, file, index ? 6 : 1]));
    });

    var chess = {
      FENtoBoard,
      pgnToFen,
      EXAMPLE_PGN,
      START_FEN,
      pieces,
      squareSize,
    };

    /* src/Board.svelte generated by Svelte v3.55.1 */

    function create_fragment$2(ctx) {
    	let layer;
    	let current;

    	layer = new Layer({
    			props: { render: /*render*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(layer.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(layer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const layer_changes = {};
    			if (dirty & /*render*/ 1) layer_changes.render = /*render*/ ctx[0];
    			layer.$set(layer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(layer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const light = '#eed4ac';
    const dark = '#ac7d58';

    function instance$2($$self, $$props, $$invalidate) {
    	let render;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Board', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Board> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Layer, squareSize: chess.squareSize, light, dark, render });

    	$$self.$inject_state = $$props => {
    		if ('render' in $$props) $$invalidate(0, render = $$props.render);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(0, render = ({ context }) => {
    		for (var i = 0; i < 8; i++) {
    			for (var j = 0; j < 8; j++) {
    				context.fillStyle = (i + j) % 2 ? dark : light;
    				context.fillRect(i * chess.squareSize, 0 + j * chess.squareSize, chess.squareSize, chess.squareSize);
    			}
    		}
    	});

    	return [render];
    }

    class Board extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Board",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Piece.svelte generated by Svelte v3.55.1 */

    function create_fragment$1(ctx) {
    	let layer;
    	let current;

    	layer = new Layer({
    			props: { render: /*render*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(layer.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(layer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const layer_changes = {};
    			if (dirty & /*render*/ 1) layer_changes.render = /*render*/ ctx[0];
    			layer.$set(layer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(layer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const images = {
    	'k': 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg',
    	'q': 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg',
    	'r': 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg',
    	'b': 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg',
    	'n': 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg',
    	'p': 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg',
    	'K': 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg',
    	'Q': 'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg',
    	'R': 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
    	'B': 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg',
    	'N': 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
    	'P': 'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg',
    	'_': ''
    };

    // Preload images
    for (const name in images) {
    	new Image().src = images[name];
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let render;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Piece', slots, []);
    	let { name, file, rank } = $$props;
    	const image = new Image(chess.squareSize, chess.squareSize);
    	image.src = images[name];

    	$$self.$$.on_mount.push(function () {
    		if (name === undefined && !('name' in $$props || $$self.$$.bound[$$self.$$.props['name']])) {
    			console.warn("<Piece> was created without expected prop 'name'");
    		}

    		if (file === undefined && !('file' in $$props || $$self.$$.bound[$$self.$$.props['file']])) {
    			console.warn("<Piece> was created without expected prop 'file'");
    		}

    		if (rank === undefined && !('rank' in $$props || $$self.$$.bound[$$self.$$.props['rank']])) {
    			console.warn("<Piece> was created without expected prop 'rank'");
    		}
    	});

    	const writable_props = ['name', 'file', 'rank'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Piece> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('file' in $$props) $$invalidate(2, file = $$props.file);
    		if ('rank' in $$props) $$invalidate(3, rank = $$props.rank);
    	};

    	$$self.$capture_state = () => ({
    		images,
    		Layer,
    		squareSize: chess.squareSize,
    		name,
    		file,
    		rank,
    		image,
    		render
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('file' in $$props) $$invalidate(2, file = $$props.file);
    		if ('rank' in $$props) $$invalidate(3, rank = $$props.rank);
    		if ('render' in $$props) $$invalidate(0, render = $$props.render);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*image, file, rank*/ 28) {
    			$$invalidate(0, render = ({ context }) => context.drawImage(image, file * chess.squareSize, rank * chess.squareSize, chess.squareSize, chess.squareSize));
    		}
    	};

    	return [render, name, file, rank, image];
    }

    class Piece extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { name: 1, file: 2, rank: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Piece",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get name() {
    		throw new Error("<Piece>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Piece>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get file() {
    		throw new Error("<Piece>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set file(value) {
    		throw new Error("<Piece>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rank() {
    		throw new Error("<Piece>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rank(value) {
    		throw new Error("<Piece>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.55.1 */

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i][0];
    	child_ctx[2] = list[i][1];
    	child_ctx[3] = list[i][2];
    	return child_ctx;
    }

    // (31:1) {#each board as [name, rank, file]}
    function create_each_block(ctx) {
    	let piece;
    	let current;

    	piece = new Piece({
    			props: {
    				name: /*name*/ ctx[1],
    				file: /*file*/ ctx[3],
    				rank: /*rank*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(piece.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(piece, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(piece.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(piece.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(piece, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(31:1) {#each board as [name, rank, file]}",
    		ctx
    	});

    	return block;
    }

    // (28:0) <Canvas {width} {height}>
    function create_default_slot(ctx) {
    	let board0;
    	let t0;
    	let board1;
    	let t1;
    	let each_1_anchor;
    	let current;
    	board0 = new Board({ $$inline: true });
    	board1 = new Board({ $$inline: true });
    	let each_value = /*board*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			create_component(board0.$$.fragment);
    			t0 = space();
    			create_component(board1.$$.fragment);
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(board0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(board1, target, anchor);
    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*board*/ 1) {
    				each_value = /*board*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(board0.$$.fragment, local);
    			transition_in(board1.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(board0.$$.fragment, local);
    			transition_out(board1.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(board0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(board1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(28:0) <Canvas {width} {height}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let t0;
    	let t1_value = /*board*/ ctx[0][0].name + "";
    	let t1;
    	let t2;
    	let t3_value = /*board*/ ctx[0][0].rank + "";
    	let t3;
    	let t4;
    	let t5_value = /*board*/ ctx[0][0].file + "";
    	let t5;
    	let t6;
    	let canvas;
    	let current;

    	canvas = new Canvas({
    			props: {
    				width,
    				height,
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t0 = text("function for pieces to FEN\n\n");
    			t1 = text(t1_value);
    			t2 = space();
    			t3 = text(t3_value);
    			t4 = space();
    			t5 = text(t5_value);
    			t6 = space();
    			create_component(canvas.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(canvas, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const canvas_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				canvas_changes.$$scope = { dirty, ctx };
    			}

    			canvas.$set(canvas_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(canvas.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(canvas.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(t6);
    			destroy_component(canvas, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const default_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const test_FEN = '5r2/8/1R6/ppk3p1/2N3P1/P4b2/1K6/5B2 w - - 0 1';
    const width = 800, height = 800;

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let board = chess.FENtoBoard(test_FEN);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Canvas,
    		Board,
    		Piece,
    		FENtoBoard: chess.FENtoBoard,
    		default_FEN,
    		test_FEN,
    		board,
    		width,
    		height
    	});

    	$$self.$inject_state = $$props => {
    		if ('board' in $$props) $$invalidate(0, board = $$props.board);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [board];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var app = new App({
      target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
