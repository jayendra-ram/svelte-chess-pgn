
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop$1() { }
    const identity = x => x;
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
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop$1;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
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

    const is_client = typeof window !== 'undefined';
    let now$1 = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop$1;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
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
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value == null) {
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

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { ownerNode } = info.stylesheet;
                // there is no ownerNode if it runs on jsdom.
                if (ownerNode)
                    detach(ownerNode);
            });
            managed_styles.clear();
        });
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
     * Schedules a callback to run immediately after the component has been updated.
     *
     * The first time the callback runs will be after the initial `onMount`
     */
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
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
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
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
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
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
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        const options = { direction: 'both' };
        let config = fn(node, params, options);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop$1, css } = config || null_transition;
            const program = {
                start: now$1() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config(options);
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
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
            flush_render_callbacks($$.after_update);
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
            update: noop$1,
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
            this.$destroy = noop$1;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop$1;
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.1' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
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
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
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

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier} [start]
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=} start
     */
    function writable(value, start = noop$1) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop$1) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop$1;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0 && stop) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    /**
     * @license
     * Copyright (c) 2023, Jeff Hlywa (jhlywa@gmail.com)
     * All rights reserved.
     *
     * Redistribution and use in source and binary forms, with or without
     * modification, are permitted provided that the following conditions are met:
     *
     * 1. Redistributions of source code must retain the above copyright notice,
     *    this list of conditions and the following disclaimer.
     * 2. Redistributions in binary form must reproduce the above copyright notice,
     *    this list of conditions and the following disclaimer in the documentation
     *    and/or other materials provided with the distribution.
     *
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
     * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
     * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
     * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
     * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
     * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
     * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
     * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
     * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
     * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
     * POSSIBILITY OF SUCH DAMAGE.
     */
    const WHITE = 'w';
    const BLACK = 'b';
    const PAWN = 'p';
    const KNIGHT = 'n';
    const BISHOP = 'b';
    const ROOK = 'r';
    const QUEEN = 'q';
    const KING = 'k';
    const DEFAULT_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const EMPTY = -1;
    const FLAGS = {
        NORMAL: 'n',
        CAPTURE: 'c',
        BIG_PAWN: 'b',
        EP_CAPTURE: 'e',
        PROMOTION: 'p',
        KSIDE_CASTLE: 'k',
        QSIDE_CASTLE: 'q',
    };
    const BITS = {
        NORMAL: 1,
        CAPTURE: 2,
        BIG_PAWN: 4,
        EP_CAPTURE: 8,
        PROMOTION: 16,
        KSIDE_CASTLE: 32,
        QSIDE_CASTLE: 64,
    };
    /*
     * NOTES ABOUT 0x88 MOVE GENERATION ALGORITHM
     * ----------------------------------------------------------------------------
     * From https://github.com/jhlywa/chess.js/issues/230
     *
     * A lot of people are confused when they first see the internal representation
     * of chess.js. It uses the 0x88 Move Generation Algorithm which internally
     * stores the board as an 8x16 array. This is purely for efficiency but has a
     * couple of interesting benefits:
     *
     * 1. 0x88 offers a very inexpensive "off the board" check. Bitwise AND (&) any
     *    square with 0x88, if the result is non-zero then the square is off the
     *    board. For example, assuming a knight square A8 (0 in 0x88 notation),
     *    there are 8 possible directions in which the knight can move. These
     *    directions are relative to the 8x16 board and are stored in the
     *    PIECE_OFFSETS map. One possible move is A8 - 18 (up one square, and two
     *    squares to the left - which is off the board). 0 - 18 = -18 & 0x88 = 0x88
     *    (because of two-complement representation of -18). The non-zero result
     *    means the square is off the board and the move is illegal. Take the
     *    opposite move (from A8 to C7), 0 + 18 = 18 & 0x88 = 0. A result of zero
     *    means the square is on the board.
     *
     * 2. The relative distance (or difference) between two squares on a 8x16 board
     *    is unique and can be used to inexpensively determine if a piece on a
     *    square can attack any other arbitrary square. For example, let's see if a
     *    pawn on E7 can attack E2. The difference between E7 (20) - E2 (100) is
     *    -80. We add 119 to make the ATTACKS array index non-negative (because the
     *    worst case difference is A8 - H1 = -119). The ATTACKS array contains a
     *    bitmask of pieces that can attack from that distance and direction.
     *    ATTACKS[-80 + 119=39] gives us 24 or 0b11000 in binary. Look at the
     *    PIECE_MASKS map to determine the mask for a given piece type. In our pawn
     *    example, we would check to see if 24 & 0x1 is non-zero, which it is
     *    not. So, naturally, a pawn on E7 can't attack a piece on E2. However, a
     *    rook can since 24 & 0x8 is non-zero. The only thing left to check is that
     *    there are no blocking pieces between E7 and E2. That's where the RAYS
     *    array comes in. It provides an offset (in this case 16) to add to E7 (20)
     *    to check for blocking pieces. E7 (20) + 16 = E6 (36) + 16 = E5 (52) etc.
     */
    // prettier-ignore
    // eslint-disable-next-line
    const Ox88 = {
        a8: 0, b8: 1, c8: 2, d8: 3, e8: 4, f8: 5, g8: 6, h8: 7,
        a7: 16, b7: 17, c7: 18, d7: 19, e7: 20, f7: 21, g7: 22, h7: 23,
        a6: 32, b6: 33, c6: 34, d6: 35, e6: 36, f6: 37, g6: 38, h6: 39,
        a5: 48, b5: 49, c5: 50, d5: 51, e5: 52, f5: 53, g5: 54, h5: 55,
        a4: 64, b4: 65, c4: 66, d4: 67, e4: 68, f4: 69, g4: 70, h4: 71,
        a3: 80, b3: 81, c3: 82, d3: 83, e3: 84, f3: 85, g3: 86, h3: 87,
        a2: 96, b2: 97, c2: 98, d2: 99, e2: 100, f2: 101, g2: 102, h2: 103,
        a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
    };
    const PAWN_OFFSETS = {
        b: [16, 32, 17, 15],
        w: [-16, -32, -17, -15],
    };
    const PIECE_OFFSETS = {
        n: [-18, -33, -31, -14, 18, 33, 31, 14],
        b: [-17, -15, 17, 15],
        r: [-16, 1, 16, -1],
        q: [-17, -16, -15, 1, 17, 16, 15, -1],
        k: [-17, -16, -15, 1, 17, 16, 15, -1],
    };
    // prettier-ignore
    const ATTACKS = [
        20, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 20, 0,
        0, 20, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 20, 0, 0,
        0, 0, 20, 0, 0, 0, 0, 24, 0, 0, 0, 0, 20, 0, 0, 0,
        0, 0, 0, 20, 0, 0, 0, 24, 0, 0, 0, 20, 0, 0, 0, 0,
        0, 0, 0, 0, 20, 0, 0, 24, 0, 0, 20, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 20, 2, 24, 2, 20, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 2, 53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
        24, 24, 24, 24, 24, 24, 56, 0, 56, 24, 24, 24, 24, 24, 24, 0,
        0, 0, 0, 0, 0, 2, 53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 20, 2, 24, 2, 20, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 20, 0, 0, 24, 0, 0, 20, 0, 0, 0, 0, 0,
        0, 0, 0, 20, 0, 0, 0, 24, 0, 0, 0, 20, 0, 0, 0, 0,
        0, 0, 20, 0, 0, 0, 0, 24, 0, 0, 0, 0, 20, 0, 0, 0,
        0, 20, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 20, 0, 0,
        20, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 20
    ];
    // prettier-ignore
    const RAYS = [
        17, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 15, 0,
        0, 17, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 15, 0, 0,
        0, 0, 17, 0, 0, 0, 0, 16, 0, 0, 0, 0, 15, 0, 0, 0,
        0, 0, 0, 17, 0, 0, 0, 16, 0, 0, 0, 15, 0, 0, 0, 0,
        0, 0, 0, 0, 17, 0, 0, 16, 0, 0, 15, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 17, 0, 16, 0, 15, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 17, 16, 15, 0, 0, 0, 0, 0, 0, 0,
        1, 1, 1, 1, 1, 1, 1, 0, -1, -1, -1, -1, -1, -1, -1, 0,
        0, 0, 0, 0, 0, 0, -15, -16, -17, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, -15, 0, -16, 0, -17, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, -15, 0, 0, -16, 0, 0, -17, 0, 0, 0, 0, 0,
        0, 0, 0, -15, 0, 0, 0, -16, 0, 0, 0, -17, 0, 0, 0, 0,
        0, 0, -15, 0, 0, 0, 0, -16, 0, 0, 0, 0, -17, 0, 0, 0,
        0, -15, 0, 0, 0, 0, 0, -16, 0, 0, 0, 0, 0, -17, 0, 0,
        -15, 0, 0, 0, 0, 0, 0, -16, 0, 0, 0, 0, 0, 0, -17
    ];
    const PIECE_MASKS = { p: 0x1, n: 0x2, b: 0x4, r: 0x8, q: 0x10, k: 0x20 };
    const SYMBOLS = 'pnbrqkPNBRQK';
    const PROMOTIONS = [KNIGHT, BISHOP, ROOK, QUEEN];
    const RANK_1 = 7;
    const RANK_2 = 6;
    /*
     * const RANK_3 = 5
     * const RANK_4 = 4
     * const RANK_5 = 3
     * const RANK_6 = 2
     */
    const RANK_7 = 1;
    const RANK_8 = 0;
    const ROOKS = {
        w: [
            { square: Ox88.a1, flag: BITS.QSIDE_CASTLE },
            { square: Ox88.h1, flag: BITS.KSIDE_CASTLE },
        ],
        b: [
            { square: Ox88.a8, flag: BITS.QSIDE_CASTLE },
            { square: Ox88.h8, flag: BITS.KSIDE_CASTLE },
        ],
    };
    const SECOND_RANK = { b: RANK_7, w: RANK_2 };
    const TERMINATION_MARKERS = ['1-0', '0-1', '1/2-1/2', '*'];
    // Extracts the zero-based rank of an 0x88 square.
    function rank(square) {
        return square >> 4;
    }
    // Extracts the zero-based file of an 0x88 square.
    function file$5(square) {
        return square & 0xf;
    }
    function isDigit(c) {
        return '0123456789'.indexOf(c) !== -1;
    }
    // Converts a 0x88 square to algebraic notation.
    function algebraic(square) {
        const f = file$5(square);
        const r = rank(square);
        return ('abcdefgh'.substring(f, f + 1) +
            '87654321'.substring(r, r + 1));
    }
    function swapColor(color) {
        return color === WHITE ? BLACK : WHITE;
    }
    function validateFen(fen) {
        // 1st criterion: 6 space-seperated fields?
        const tokens = fen.split(/\s+/);
        if (tokens.length !== 6) {
            return {
                ok: false,
                error: 'Invalid FEN: must contain six space-delimited fields',
            };
        }
        // 2nd criterion: move number field is a integer value > 0?
        const moveNumber = parseInt(tokens[5], 10);
        if (isNaN(moveNumber) || moveNumber <= 0) {
            return {
                ok: false,
                error: 'Invalid FEN: move number must be a positive integer',
            };
        }
        // 3rd criterion: half move counter is an integer >= 0?
        const halfMoves = parseInt(tokens[4], 10);
        if (isNaN(halfMoves) || halfMoves < 0) {
            return {
                ok: false,
                error: 'Invalid FEN: half move counter number must be a non-negative integer',
            };
        }
        // 4th criterion: 4th field is a valid e.p.-string?
        if (!/^(-|[abcdefgh][36])$/.test(tokens[3])) {
            return { ok: false, error: 'Invalid FEN: en-passant square is invalid' };
        }
        // 5th criterion: 3th field is a valid castle-string?
        if (/[^kKqQ-]/.test(tokens[2])) {
            return { ok: false, error: 'Invalid FEN: castling availability is invalid' };
        }
        // 6th criterion: 2nd field is "w" (white) or "b" (black)?
        if (!/^(w|b)$/.test(tokens[1])) {
            return { ok: false, error: 'Invalid FEN: side-to-move is invalid' };
        }
        // 7th criterion: 1st field contains 8 rows?
        const rows = tokens[0].split('/');
        if (rows.length !== 8) {
            return {
                ok: false,
                error: "Invalid FEN: piece data does not contain 8 '/'-delimited rows",
            };
        }
        // 8th criterion: every row is valid?
        for (let i = 0; i < rows.length; i++) {
            // check for right sum of fields AND not two numbers in succession
            let sumFields = 0;
            let previousWasNumber = false;
            for (let k = 0; k < rows[i].length; k++) {
                if (isDigit(rows[i][k])) {
                    if (previousWasNumber) {
                        return {
                            ok: false,
                            error: 'Invalid FEN: piece data is invalid (consecutive number)',
                        };
                    }
                    sumFields += parseInt(rows[i][k], 10);
                    previousWasNumber = true;
                }
                else {
                    if (!/^[prnbqkPRNBQK]$/.test(rows[i][k])) {
                        return {
                            ok: false,
                            error: 'Invalid FEN: piece data is invalid (invalid piece)',
                        };
                    }
                    sumFields += 1;
                    previousWasNumber = false;
                }
            }
            if (sumFields !== 8) {
                return {
                    ok: false,
                    error: 'Invalid FEN: piece data is invalid (too many squares in rank)',
                };
            }
        }
        if ((tokens[3][1] == '3' && tokens[1] == 'w') ||
            (tokens[3][1] == '6' && tokens[1] == 'b')) {
            return { ok: false, error: 'Invalid FEN: illegal en-passant square' };
        }
        const kings = [
            { color: 'white', regex: /K/g },
            { color: 'black', regex: /k/g },
        ];
        for (const { color, regex } of kings) {
            if (!regex.test(tokens[0])) {
                return { ok: false, error: `Invalid FEN: missing ${color} king` };
            }
            if ((tokens[0].match(regex) || []).length > 1) {
                return { ok: false, error: `Invalid FEN: too many ${color} kings` };
            }
        }
        return { ok: true };
    }
    // this function is used to uniquely identify ambiguous moves
    function getDisambiguator(move, moves) {
        const from = move.from;
        const to = move.to;
        const piece = move.piece;
        let ambiguities = 0;
        let sameRank = 0;
        let sameFile = 0;
        for (let i = 0, len = moves.length; i < len; i++) {
            const ambigFrom = moves[i].from;
            const ambigTo = moves[i].to;
            const ambigPiece = moves[i].piece;
            /*
             * if a move of the same piece type ends on the same to square, we'll need
             * to add a disambiguator to the algebraic notation
             */
            if (piece === ambigPiece && from !== ambigFrom && to === ambigTo) {
                ambiguities++;
                if (rank(from) === rank(ambigFrom)) {
                    sameRank++;
                }
                if (file$5(from) === file$5(ambigFrom)) {
                    sameFile++;
                }
            }
        }
        if (ambiguities > 0) {
            if (sameRank > 0 && sameFile > 0) {
                /*
                 * if there exists a similar moving piece on the same rank and file as
                 * the move in question, use the square as the disambiguator
                 */
                return algebraic(from);
            }
            else if (sameFile > 0) {
                /*
                 * if the moving piece rests on the same file, use the rank symbol as the
                 * disambiguator
                 */
                return algebraic(from).charAt(1);
            }
            else {
                // else use the file symbol
                return algebraic(from).charAt(0);
            }
        }
        return '';
    }
    function addMove(moves, color, from, to, piece, captured = undefined, flags = BITS.NORMAL) {
        const r = rank(to);
        if (piece === PAWN && (r === RANK_1 || r === RANK_8)) {
            for (let i = 0; i < PROMOTIONS.length; i++) {
                const promotion = PROMOTIONS[i];
                moves.push({
                    color,
                    from,
                    to,
                    piece,
                    captured,
                    promotion,
                    flags: flags | BITS.PROMOTION,
                });
            }
        }
        else {
            moves.push({
                color,
                from,
                to,
                piece,
                captured,
                flags,
            });
        }
    }
    function inferPieceType(san) {
        let pieceType = san.charAt(0);
        if (pieceType >= 'a' && pieceType <= 'h') {
            const matches = san.match(/[a-h]\d.*[a-h]\d/);
            if (matches) {
                return undefined;
            }
            return PAWN;
        }
        pieceType = pieceType.toLowerCase();
        if (pieceType === 'o') {
            return KING;
        }
        return pieceType;
    }
    // parses all of the decorators out of a SAN string
    function strippedSan(move) {
        return move.replace(/=/, '').replace(/[+#]?[?!]*$/, '');
    }
    class Chess {
        constructor(fen = DEFAULT_POSITION) {
            this._board = new Array(128);
            this._turn = WHITE;
            this._header = {};
            this._kings = { w: EMPTY, b: EMPTY };
            this._epSquare = -1;
            this._halfMoves = 0;
            this._moveNumber = 0;
            this._history = [];
            this._comments = {};
            this._castling = { w: 0, b: 0 };
            this.load(fen);
        }
        clear(keepHeaders = false) {
            this._board = new Array(128);
            this._kings = { w: EMPTY, b: EMPTY };
            this._turn = WHITE;
            this._castling = { w: 0, b: 0 };
            this._epSquare = EMPTY;
            this._halfMoves = 0;
            this._moveNumber = 1;
            this._history = [];
            this._comments = {};
            this._header = keepHeaders ? this._header : {};
            this._updateSetup(this.fen());
        }
        load(fen, keepHeaders = false) {
            let tokens = fen.split(/\s+/);
            // append commonly omitted fen tokens
            if (tokens.length >= 2 && tokens.length < 6) {
                const adjustments = ['-', '-', '0', '1'];
                fen = tokens.concat(adjustments.slice(-(6 - tokens.length))).join(' ');
            }
            tokens = fen.split(/\s+/);
            const { ok, error } = validateFen(fen);
            if (!ok) {
                throw new Error(error);
            }
            const position = tokens[0];
            let square = 0;
            this.clear(keepHeaders);
            for (let i = 0; i < position.length; i++) {
                const piece = position.charAt(i);
                if (piece === '/') {
                    square += 8;
                }
                else if (isDigit(piece)) {
                    square += parseInt(piece, 10);
                }
                else {
                    const color = piece < 'a' ? WHITE : BLACK;
                    this.put({ type: piece.toLowerCase(), color }, algebraic(square));
                    square++;
                }
            }
            this._turn = tokens[1];
            if (tokens[2].indexOf('K') > -1) {
                this._castling.w |= BITS.KSIDE_CASTLE;
            }
            if (tokens[2].indexOf('Q') > -1) {
                this._castling.w |= BITS.QSIDE_CASTLE;
            }
            if (tokens[2].indexOf('k') > -1) {
                this._castling.b |= BITS.KSIDE_CASTLE;
            }
            if (tokens[2].indexOf('q') > -1) {
                this._castling.b |= BITS.QSIDE_CASTLE;
            }
            this._epSquare = tokens[3] === '-' ? EMPTY : Ox88[tokens[3]];
            this._halfMoves = parseInt(tokens[4], 10);
            this._moveNumber = parseInt(tokens[5], 10);
            this._updateSetup(this.fen());
        }
        fen() {
            var _a, _b;
            let empty = 0;
            let fen = '';
            for (let i = Ox88.a8; i <= Ox88.h1; i++) {
                if (this._board[i]) {
                    if (empty > 0) {
                        fen += empty;
                        empty = 0;
                    }
                    const { color, type: piece } = this._board[i];
                    fen += color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
                }
                else {
                    empty++;
                }
                if ((i + 1) & 0x88) {
                    if (empty > 0) {
                        fen += empty;
                    }
                    if (i !== Ox88.h1) {
                        fen += '/';
                    }
                    empty = 0;
                    i += 8;
                }
            }
            let castling = '';
            if (this._castling[WHITE] & BITS.KSIDE_CASTLE) {
                castling += 'K';
            }
            if (this._castling[WHITE] & BITS.QSIDE_CASTLE) {
                castling += 'Q';
            }
            if (this._castling[BLACK] & BITS.KSIDE_CASTLE) {
                castling += 'k';
            }
            if (this._castling[BLACK] & BITS.QSIDE_CASTLE) {
                castling += 'q';
            }
            // do we have an empty castling flag?
            castling = castling || '-';
            let epSquare = '-';
            /*
             * only print the ep square if en passant is a valid move (pawn is present
             * and ep capture is not pinned)
             */
            if (this._epSquare !== EMPTY) {
                const bigPawnSquare = this._epSquare + (this._turn === WHITE ? 16 : -16);
                const squares = [bigPawnSquare + 1, bigPawnSquare - 1];
                for (const square of squares) {
                    // is the square off the board?
                    if (square & 0x88) {
                        continue;
                    }
                    const color = this._turn;
                    // is there a pawn that can capture the epSquare?
                    if (((_a = this._board[square]) === null || _a === void 0 ? void 0 : _a.color) === color &&
                        ((_b = this._board[square]) === null || _b === void 0 ? void 0 : _b.type) === PAWN) {
                        // if the pawn makes an ep capture, does it leave it's king in check?
                        this._makeMove({
                            color,
                            from: square,
                            to: this._epSquare,
                            piece: PAWN,
                            captured: PAWN,
                            flags: BITS.EP_CAPTURE,
                        });
                        const isLegal = !this._isKingAttacked(color);
                        this._undoMove();
                        // if ep is legal, break and set the ep square in the FEN output
                        if (isLegal) {
                            epSquare = algebraic(this._epSquare);
                            break;
                        }
                    }
                }
            }
            return [
                fen,
                this._turn,
                castling,
                epSquare,
                this._halfMoves,
                this._moveNumber,
            ].join(' ');
        }
        /*
         * Called when the initial board setup is changed with put() or remove().
         * modifies the SetUp and FEN properties of the header object. If the FEN
         * is equal to the default position, the SetUp and FEN are deleted the setup
         * is only updated if history.length is zero, ie moves haven't been made.
         */
        _updateSetup(fen) {
            if (this._history.length > 0)
                return;
            if (fen !== DEFAULT_POSITION) {
                this._header['SetUp'] = '1';
                this._header['FEN'] = fen;
            }
            else {
                delete this._header['SetUp'];
                delete this._header['FEN'];
            }
        }
        reset() {
            this.load(DEFAULT_POSITION);
        }
        get(square) {
            return this._board[Ox88[square]] || false;
        }
        put({ type, color }, square) {
            // check for piece
            if (SYMBOLS.indexOf(type.toLowerCase()) === -1) {
                return false;
            }
            // check for valid square
            if (!(square in Ox88)) {
                return false;
            }
            const sq = Ox88[square];
            // don't let the user place more than one king
            if (type == KING &&
                !(this._kings[color] == EMPTY || this._kings[color] == sq)) {
                return false;
            }
            this._board[sq] = { type: type, color: color };
            if (type === KING) {
                this._kings[color] = sq;
            }
            this._updateSetup(this.fen());
            return true;
        }
        remove(square) {
            const piece = this.get(square);
            delete this._board[Ox88[square]];
            if (piece && piece.type === KING) {
                this._kings[piece.color] = EMPTY;
            }
            this._updateSetup(this.fen());
            return piece;
        }
        _attacked(color, square) {
            for (let i = Ox88.a8; i <= Ox88.h1; i++) {
                // did we run off the end of the board
                if (i & 0x88) {
                    i += 7;
                    continue;
                }
                // if empty square or wrong color
                if (this._board[i] === undefined || this._board[i].color !== color) {
                    continue;
                }
                const piece = this._board[i];
                const difference = i - square;
                // skip - to/from square are the same
                if (difference === 0) {
                    continue;
                }
                const index = difference + 119;
                if (ATTACKS[index] & PIECE_MASKS[piece.type]) {
                    if (piece.type === PAWN) {
                        if (difference > 0) {
                            if (piece.color === WHITE)
                                return true;
                        }
                        else {
                            if (piece.color === BLACK)
                                return true;
                        }
                        continue;
                    }
                    // if the piece is a knight or a king
                    if (piece.type === 'n' || piece.type === 'k')
                        return true;
                    const offset = RAYS[index];
                    let j = i + offset;
                    let blocked = false;
                    while (j !== square) {
                        if (this._board[j] != null) {
                            blocked = true;
                            break;
                        }
                        j += offset;
                    }
                    if (!blocked)
                        return true;
                }
            }
            return false;
        }
        _isKingAttacked(color) {
            return this._attacked(swapColor(color), this._kings[color]);
        }
        isAttacked(square, attackedBy) {
            return this._attacked(attackedBy, Ox88[square]);
        }
        isCheck() {
            return this._isKingAttacked(this._turn);
        }
        inCheck() {
            return this.isCheck();
        }
        isCheckmate() {
            return this.isCheck() && this._moves().length === 0;
        }
        isStalemate() {
            return !this.isCheck() && this._moves().length === 0;
        }
        isInsufficientMaterial() {
            /*
             * k.b. vs k.b. (of opposite colors) with mate in 1:
             * 8/8/8/8/1b6/8/B1k5/K7 b - - 0 1
             *
             * k.b. vs k.n. with mate in 1:
             * 8/8/8/8/1n6/8/B7/K1k5 b - - 2 1
             */
            const pieces = {
                b: 0,
                n: 0,
                r: 0,
                q: 0,
                k: 0,
                p: 0,
            };
            const bishops = [];
            let numPieces = 0;
            let squareColor = 0;
            for (let i = Ox88.a8; i <= Ox88.h1; i++) {
                squareColor = (squareColor + 1) % 2;
                if (i & 0x88) {
                    i += 7;
                    continue;
                }
                const piece = this._board[i];
                if (piece) {
                    pieces[piece.type] = piece.type in pieces ? pieces[piece.type] + 1 : 1;
                    if (piece.type === BISHOP) {
                        bishops.push(squareColor);
                    }
                    numPieces++;
                }
            }
            // k vs. k
            if (numPieces === 2) {
                return true;
            }
            else if (
            // k vs. kn .... or .... k vs. kb
            numPieces === 3 &&
                (pieces[BISHOP] === 1 || pieces[KNIGHT] === 1)) {
                return true;
            }
            else if (numPieces === pieces[BISHOP] + 2) {
                // kb vs. kb where any number of bishops are all on the same color
                let sum = 0;
                const len = bishops.length;
                for (let i = 0; i < len; i++) {
                    sum += bishops[i];
                }
                if (sum === 0 || sum === len) {
                    return true;
                }
            }
            return false;
        }
        isThreefoldRepetition() {
            const moves = [];
            const positions = {};
            let repetition = false;
            while (true) {
                const move = this._undoMove();
                if (!move)
                    break;
                moves.push(move);
            }
            while (true) {
                /*
                 * remove the last two fields in the FEN string, they're not needed when
                 * checking for draw by rep
                 */
                const fen = this.fen().split(' ').slice(0, 4).join(' ');
                // has the position occurred three or move times
                positions[fen] = fen in positions ? positions[fen] + 1 : 1;
                if (positions[fen] >= 3) {
                    repetition = true;
                }
                const move = moves.pop();
                if (!move) {
                    break;
                }
                else {
                    this._makeMove(move);
                }
            }
            return repetition;
        }
        isDraw() {
            return (this._halfMoves >= 100 || // 50 moves per side = 100 half moves
                this.isStalemate() ||
                this.isInsufficientMaterial() ||
                this.isThreefoldRepetition());
        }
        isGameOver() {
            return this.isCheckmate() || this.isStalemate() || this.isDraw();
        }
        moves({ verbose = false, square = undefined, piece = undefined, } = {}) {
            const moves = this._moves({ square, piece });
            if (verbose) {
                return moves.map((move) => this._makePretty(move));
            }
            else {
                return moves.map((move) => this._moveToSan(move, moves));
            }
        }
        _moves({ legal = true, piece = undefined, square = undefined, } = {}) {
            var _a;
            const forSquare = square ? square.toLowerCase() : undefined;
            const forPiece = piece === null || piece === void 0 ? void 0 : piece.toLowerCase();
            const moves = [];
            const us = this._turn;
            const them = swapColor(us);
            let firstSquare = Ox88.a8;
            let lastSquare = Ox88.h1;
            let singleSquare = false;
            // are we generating moves for a single square?
            if (forSquare) {
                // illegal square, return empty moves
                if (!(forSquare in Ox88)) {
                    return [];
                }
                else {
                    firstSquare = lastSquare = Ox88[forSquare];
                    singleSquare = true;
                }
            }
            for (let from = firstSquare; from <= lastSquare; from++) {
                // did we run off the end of the board
                if (from & 0x88) {
                    from += 7;
                    continue;
                }
                // empty square or opponent, skip
                if (!this._board[from] || this._board[from].color === them) {
                    continue;
                }
                const { type } = this._board[from];
                let to;
                if (type === PAWN) {
                    if (forPiece && forPiece !== type)
                        continue;
                    // single square, non-capturing
                    to = from + PAWN_OFFSETS[us][0];
                    if (!this._board[to]) {
                        addMove(moves, us, from, to, PAWN);
                        // double square
                        to = from + PAWN_OFFSETS[us][1];
                        if (SECOND_RANK[us] === rank(from) && !this._board[to]) {
                            addMove(moves, us, from, to, PAWN, undefined, BITS.BIG_PAWN);
                        }
                    }
                    // pawn captures
                    for (let j = 2; j < 4; j++) {
                        to = from + PAWN_OFFSETS[us][j];
                        if (to & 0x88)
                            continue;
                        if (((_a = this._board[to]) === null || _a === void 0 ? void 0 : _a.color) === them) {
                            addMove(moves, us, from, to, PAWN, this._board[to].type, BITS.CAPTURE);
                        }
                        else if (to === this._epSquare) {
                            addMove(moves, us, from, to, PAWN, PAWN, BITS.EP_CAPTURE);
                        }
                    }
                }
                else {
                    if (forPiece && forPiece !== type)
                        continue;
                    for (let j = 0, len = PIECE_OFFSETS[type].length; j < len; j++) {
                        const offset = PIECE_OFFSETS[type][j];
                        to = from;
                        while (true) {
                            to += offset;
                            if (to & 0x88)
                                break;
                            if (!this._board[to]) {
                                addMove(moves, us, from, to, type);
                            }
                            else {
                                // own color, stop loop
                                if (this._board[to].color === us)
                                    break;
                                addMove(moves, us, from, to, type, this._board[to].type, BITS.CAPTURE);
                                break;
                            }
                            /* break, if knight or king */
                            if (type === KNIGHT || type === KING)
                                break;
                        }
                    }
                }
            }
            /*
             * check for castling if we're:
             *   a) generating all moves, or
             *   b) doing single square move generation on the king's square
             */
            if (forPiece === undefined || forPiece === KING) {
                if (!singleSquare || lastSquare === this._kings[us]) {
                    // king-side castling
                    if (this._castling[us] & BITS.KSIDE_CASTLE) {
                        const castlingFrom = this._kings[us];
                        const castlingTo = castlingFrom + 2;
                        if (!this._board[castlingFrom + 1] &&
                            !this._board[castlingTo] &&
                            !this._attacked(them, this._kings[us]) &&
                            !this._attacked(them, castlingFrom + 1) &&
                            !this._attacked(them, castlingTo)) {
                            addMove(moves, us, this._kings[us], castlingTo, KING, undefined, BITS.KSIDE_CASTLE);
                        }
                    }
                    // queen-side castling
                    if (this._castling[us] & BITS.QSIDE_CASTLE) {
                        const castlingFrom = this._kings[us];
                        const castlingTo = castlingFrom - 2;
                        if (!this._board[castlingFrom - 1] &&
                            !this._board[castlingFrom - 2] &&
                            !this._board[castlingFrom - 3] &&
                            !this._attacked(them, this._kings[us]) &&
                            !this._attacked(them, castlingFrom - 1) &&
                            !this._attacked(them, castlingTo)) {
                            addMove(moves, us, this._kings[us], castlingTo, KING, undefined, BITS.QSIDE_CASTLE);
                        }
                    }
                }
            }
            /*
             * return all pseudo-legal moves (this includes moves that allow the king
             * to be captured)
             */
            if (!legal) {
                return moves;
            }
            // filter out illegal moves
            const legalMoves = [];
            for (let i = 0, len = moves.length; i < len; i++) {
                this._makeMove(moves[i]);
                if (!this._isKingAttacked(us)) {
                    legalMoves.push(moves[i]);
                }
                this._undoMove();
            }
            return legalMoves;
        }
        move(move, { strict = false } = {}) {
            /*
             * The move function can be called with in the following parameters:
             *
             * .move('Nxb7')       <- argument is a case-sensitive SAN string
             *
             * .move({ from: 'h7', <- argument is a move object
             *         to :'h8',
             *         promotion: 'q' })
             *
             *
             * An optional strict argument may be supplied to tell chess.js to
             * strictly follow the SAN specification.
             */
            let moveObj = null;
            if (typeof move === 'string') {
                moveObj = this._moveFromSan(move, strict);
            }
            else if (typeof move === 'object') {
                const moves = this._moves();
                // convert the pretty move object to an ugly move object
                for (let i = 0, len = moves.length; i < len; i++) {
                    if (move.from === algebraic(moves[i].from) &&
                        move.to === algebraic(moves[i].to) &&
                        (!('promotion' in moves[i]) || move.promotion === moves[i].promotion)) {
                        moveObj = moves[i];
                        break;
                    }
                }
            }
            // failed to find move
            if (!moveObj) {
                if (typeof move === 'string') {
                    throw new Error(`Invalid move: ${move}`);
                }
                else {
                    throw new Error(`Invalid move: ${JSON.stringify(move)}`);
                }
            }
            /*
             * need to make a copy of move because we can't generate SAN after the move
             * is made
             */
            const prettyMove = this._makePretty(moveObj);
            this._makeMove(moveObj);
            return prettyMove;
        }
        _push(move) {
            this._history.push({
                move,
                kings: { b: this._kings.b, w: this._kings.w },
                turn: this._turn,
                castling: { b: this._castling.b, w: this._castling.w },
                epSquare: this._epSquare,
                halfMoves: this._halfMoves,
                moveNumber: this._moveNumber,
            });
        }
        _makeMove(move) {
            const us = this._turn;
            const them = swapColor(us);
            this._push(move);
            this._board[move.to] = this._board[move.from];
            delete this._board[move.from];
            // if ep capture, remove the captured pawn
            if (move.flags & BITS.EP_CAPTURE) {
                if (this._turn === BLACK) {
                    delete this._board[move.to - 16];
                }
                else {
                    delete this._board[move.to + 16];
                }
            }
            // if pawn promotion, replace with new piece
            if (move.promotion) {
                this._board[move.to] = { type: move.promotion, color: us };
            }
            // if we moved the king
            if (this._board[move.to].type === KING) {
                this._kings[us] = move.to;
                // if we castled, move the rook next to the king
                if (move.flags & BITS.KSIDE_CASTLE) {
                    const castlingTo = move.to - 1;
                    const castlingFrom = move.to + 1;
                    this._board[castlingTo] = this._board[castlingFrom];
                    delete this._board[castlingFrom];
                }
                else if (move.flags & BITS.QSIDE_CASTLE) {
                    const castlingTo = move.to + 1;
                    const castlingFrom = move.to - 2;
                    this._board[castlingTo] = this._board[castlingFrom];
                    delete this._board[castlingFrom];
                }
                // turn off castling
                this._castling[us] = 0;
            }
            // turn off castling if we move a rook
            if (this._castling[us]) {
                for (let i = 0, len = ROOKS[us].length; i < len; i++) {
                    if (move.from === ROOKS[us][i].square &&
                        this._castling[us] & ROOKS[us][i].flag) {
                        this._castling[us] ^= ROOKS[us][i].flag;
                        break;
                    }
                }
            }
            // turn off castling if we capture a rook
            if (this._castling[them]) {
                for (let i = 0, len = ROOKS[them].length; i < len; i++) {
                    if (move.to === ROOKS[them][i].square &&
                        this._castling[them] & ROOKS[them][i].flag) {
                        this._castling[them] ^= ROOKS[them][i].flag;
                        break;
                    }
                }
            }
            // if big pawn move, update the en passant square
            if (move.flags & BITS.BIG_PAWN) {
                if (us === BLACK) {
                    this._epSquare = move.to - 16;
                }
                else {
                    this._epSquare = move.to + 16;
                }
            }
            else {
                this._epSquare = EMPTY;
            }
            // reset the 50 move counter if a pawn is moved or a piece is captured
            if (move.piece === PAWN) {
                this._halfMoves = 0;
            }
            else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
                this._halfMoves = 0;
            }
            else {
                this._halfMoves++;
            }
            if (us === BLACK) {
                this._moveNumber++;
            }
            this._turn = them;
        }
        undo() {
            const move = this._undoMove();
            return move ? this._makePretty(move) : null;
        }
        _undoMove() {
            const old = this._history.pop();
            if (old === undefined) {
                return null;
            }
            const move = old.move;
            this._kings = old.kings;
            this._turn = old.turn;
            this._castling = old.castling;
            this._epSquare = old.epSquare;
            this._halfMoves = old.halfMoves;
            this._moveNumber = old.moveNumber;
            const us = this._turn;
            const them = swapColor(us);
            this._board[move.from] = this._board[move.to];
            this._board[move.from].type = move.piece; // to undo any promotions
            delete this._board[move.to];
            if (move.captured) {
                if (move.flags & BITS.EP_CAPTURE) {
                    // en passant capture
                    let index;
                    if (us === BLACK) {
                        index = move.to - 16;
                    }
                    else {
                        index = move.to + 16;
                    }
                    this._board[index] = { type: PAWN, color: them };
                }
                else {
                    // regular capture
                    this._board[move.to] = { type: move.captured, color: them };
                }
            }
            if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
                let castlingTo, castlingFrom;
                if (move.flags & BITS.KSIDE_CASTLE) {
                    castlingTo = move.to + 1;
                    castlingFrom = move.to - 1;
                }
                else {
                    castlingTo = move.to - 2;
                    castlingFrom = move.to + 1;
                }
                this._board[castlingTo] = this._board[castlingFrom];
                delete this._board[castlingFrom];
            }
            return move;
        }
        pgn({ newline = '\n', maxWidth = 0, } = {}) {
            /*
             * using the specification from http://www.chessclub.com/help/PGN-spec
             * example for html usage: .pgn({ max_width: 72, newline_char: "<br />" })
             */
            const result = [];
            let headerExists = false;
            /* add the PGN header information */
            for (const i in this._header) {
                /*
                 * TODO: order of enumerated properties in header object is not
                 * guaranteed, see ECMA-262 spec (section 12.6.4)
                 */
                result.push('[' + i + ' "' + this._header[i] + '"]' + newline);
                headerExists = true;
            }
            if (headerExists && this._history.length) {
                result.push(newline);
            }
            const appendComment = (moveString) => {
                const comment = this._comments[this.fen()];
                if (typeof comment !== 'undefined') {
                    const delimiter = moveString.length > 0 ? ' ' : '';
                    moveString = `${moveString}${delimiter}{${comment}}`;
                }
                return moveString;
            };
            // pop all of history onto reversed_history
            const reversedHistory = [];
            while (this._history.length > 0) {
                reversedHistory.push(this._undoMove());
            }
            const moves = [];
            let moveString = '';
            // special case of a commented starting position with no moves
            if (reversedHistory.length === 0) {
                moves.push(appendComment(''));
            }
            // build the list of moves.  a move_string looks like: "3. e3 e6"
            while (reversedHistory.length > 0) {
                moveString = appendComment(moveString);
                const move = reversedHistory.pop();
                // make TypeScript stop complaining about move being undefined
                if (!move) {
                    break;
                }
                // if the position started with black to move, start PGN with #. ...
                if (!this._history.length && move.color === 'b') {
                    const prefix = `${this._moveNumber}. ...`;
                    // is there a comment preceding the first move?
                    moveString = moveString ? `${moveString} ${prefix}` : prefix;
                }
                else if (move.color === 'w') {
                    // store the previous generated move_string if we have one
                    if (moveString.length) {
                        moves.push(moveString);
                    }
                    moveString = this._moveNumber + '.';
                }
                moveString =
                    moveString + ' ' + this._moveToSan(move, this._moves({ legal: true }));
                this._makeMove(move);
            }
            // are there any other leftover moves?
            if (moveString.length) {
                moves.push(appendComment(moveString));
            }
            // is there a result?
            if (typeof this._header.Result !== 'undefined') {
                moves.push(this._header.Result);
            }
            /*
             * history should be back to what it was before we started generating PGN,
             * so join together moves
             */
            if (maxWidth === 0) {
                return result.join('') + moves.join(' ');
            }
            // TODO (jah): huh?
            const strip = function () {
                if (result.length > 0 && result[result.length - 1] === ' ') {
                    result.pop();
                    return true;
                }
                return false;
            };
            // NB: this does not preserve comment whitespace.
            const wrapComment = function (width, move) {
                for (const token of move.split(' ')) {
                    if (!token) {
                        continue;
                    }
                    if (width + token.length > maxWidth) {
                        while (strip()) {
                            width--;
                        }
                        result.push(newline);
                        width = 0;
                    }
                    result.push(token);
                    width += token.length;
                    result.push(' ');
                    width++;
                }
                if (strip()) {
                    width--;
                }
                return width;
            };
            // wrap the PGN output at max_width
            let currentWidth = 0;
            for (let i = 0; i < moves.length; i++) {
                if (currentWidth + moves[i].length > maxWidth) {
                    if (moves[i].includes('{')) {
                        currentWidth = wrapComment(currentWidth, moves[i]);
                        continue;
                    }
                }
                // if the current move will push past max_width
                if (currentWidth + moves[i].length > maxWidth && i !== 0) {
                    // don't end the line with whitespace
                    if (result[result.length - 1] === ' ') {
                        result.pop();
                    }
                    result.push(newline);
                    currentWidth = 0;
                }
                else if (i !== 0) {
                    result.push(' ');
                    currentWidth++;
                }
                result.push(moves[i]);
                currentWidth += moves[i].length;
            }
            return result.join('');
        }
        header(...args) {
            for (let i = 0; i < args.length; i += 2) {
                if (typeof args[i] === 'string' && typeof args[i + 1] === 'string') {
                    this._header[args[i]] = args[i + 1];
                }
            }
            return this._header;
        }
        loadPgn(pgn, { strict = false, newlineChar = '\r?\n', } = {}) {
            function mask(str) {
                return str.replace(/\\/g, '\\');
            }
            function parsePgnHeader(header) {
                const headerObj = {};
                const headers = header.split(new RegExp(mask(newlineChar)));
                let key = '';
                let value = '';
                for (let i = 0; i < headers.length; i++) {
                    const regex = /^\s*\[\s*([A-Za-z]+)\s*"(.*)"\s*\]\s*$/;
                    key = headers[i].replace(regex, '$1');
                    value = headers[i].replace(regex, '$2');
                    if (key.trim().length > 0) {
                        headerObj[key] = value;
                    }
                }
                return headerObj;
            }
            // strip whitespace from head/tail of PGN block
            pgn = pgn.trim();
            /*
             * RegExp to split header. Takes advantage of the fact that header and movetext
             * will always have a blank line between them (ie, two newline_char's). Handles
             * case where movetext is empty by matching newlineChar until end of string is
             * matched - effectively trimming from the end extra newlineChar.
             *
             * With default newline_char, will equal:
             * /^(\[((?:\r?\n)|.)*\])((?:\s*\r?\n){2}|(?:\s*\r?\n)*$)/
             */
            const headerRegex = new RegExp('^(\\[((?:' +
                mask(newlineChar) +
                ')|.)*\\])' +
                '((?:\\s*' +
                mask(newlineChar) +
                '){2}|(?:\\s*' +
                mask(newlineChar) +
                ')*$)');
            // If no header given, begin with moves.
            const headerRegexResults = headerRegex.exec(pgn);
            const headerString = headerRegexResults
                ? headerRegexResults.length >= 2
                    ? headerRegexResults[1]
                    : ''
                : '';
            // Put the board in the starting position
            this.reset();
            // parse PGN header
            const headers = parsePgnHeader(headerString);
            let fen = '';
            for (const key in headers) {
                // check to see user is including fen (possibly with wrong tag case)
                if (key.toLowerCase() === 'fen') {
                    fen = headers[key];
                }
                this.header(key, headers[key]);
            }
            /*
             * the permissive parser should attempt to load a fen tag, even if it's the
             * wrong case and doesn't include a corresponding [SetUp "1"] tag
             */
            if (!strict) {
                if (fen) {
                    this.load(fen, true);
                }
            }
            else {
                /*
                 * strict parser - load the starting position indicated by [Setup '1']
                 * and [FEN position]
                 */
                if (headers['SetUp'] === '1') {
                    if (!('FEN' in headers)) {
                        throw new Error('Invalid PGN: FEN tag must be supplied with SetUp tag');
                    }
                    // second argument to load: don't clear the headers
                    this.load(headers['FEN'], true);
                }
            }
            /*
             * NB: the regexes below that delete move numbers, recursive annotations,
             * and numeric annotation glyphs may also match text in comments. To
             * prevent this, we transform comments by hex-encoding them in place and
             * decoding them again after the other tokens have been deleted.
             *
             * While the spec states that PGN files should be ASCII encoded, we use
             * {en,de}codeURIComponent here to support arbitrary UTF8 as a convenience
             * for modern users
             */
            function toHex(s) {
                return Array.from(s)
                    .map(function (c) {
                    /*
                     * encodeURI doesn't transform most ASCII characters, so we handle
                     * these ourselves
                     */
                    return c.charCodeAt(0) < 128
                        ? c.charCodeAt(0).toString(16)
                        : encodeURIComponent(c).replace(/%/g, '').toLowerCase();
                })
                    .join('');
            }
            function fromHex(s) {
                return s.length == 0
                    ? ''
                    : decodeURIComponent('%' + (s.match(/.{1,2}/g) || []).join('%'));
            }
            const encodeComment = function (s) {
                s = s.replace(new RegExp(mask(newlineChar), 'g'), ' ');
                return `{${toHex(s.slice(1, s.length - 1))}}`;
            };
            const decodeComment = function (s) {
                if (s.startsWith('{') && s.endsWith('}')) {
                    return fromHex(s.slice(1, s.length - 1));
                }
            };
            // delete header to get the moves
            let ms = pgn
                .replace(headerString, '')
                .replace(
            // encode comments so they don't get deleted below
            new RegExp(`({[^}]*})+?|;([^${mask(newlineChar)}]*)`, 'g'), function (_match, bracket, semicolon) {
                return bracket !== undefined
                    ? encodeComment(bracket)
                    : ' ' + encodeComment(`{${semicolon.slice(1)}}`);
            })
                .replace(new RegExp(mask(newlineChar), 'g'), ' ');
            // delete recursive annotation variations
            const ravRegex = /(\([^()]+\))+?/g;
            while (ravRegex.test(ms)) {
                ms = ms.replace(ravRegex, '');
            }
            // delete move numbers
            ms = ms.replace(/\d+\.(\.\.)?/g, '');
            // delete ... indicating black to move
            ms = ms.replace(/\.\.\./g, '');
            /* delete numeric annotation glyphs */
            ms = ms.replace(/\$\d+/g, '');
            // trim and get array of moves
            let moves = ms.trim().split(new RegExp(/\s+/));
            // delete empty entries
            moves = moves.filter((move) => move !== '');
            let result = '';
            for (let halfMove = 0; halfMove < moves.length; halfMove++) {
                const comment = decodeComment(moves[halfMove]);
                if (comment !== undefined) {
                    this._comments[this.fen()] = comment;
                    continue;
                }
                const move = this._moveFromSan(moves[halfMove], strict);
                // invalid move
                if (move == null) {
                    // was the move an end of game marker
                    if (TERMINATION_MARKERS.indexOf(moves[halfMove]) > -1) {
                        result = moves[halfMove];
                    }
                    else {
                        throw new Error(`Invalid move in PGN: ${moves[halfMove]}`);
                    }
                }
                else {
                    // reset the end of game marker if making a valid move
                    result = '';
                    this._makeMove(move);
                }
            }
            /*
             * Per section 8.2.6 of the PGN spec, the Result tag pair must match match
             * the termination marker. Only do this when headers are present, but the
             * result tag is missing
             */
            if (result && Object.keys(this._header).length && !this._header['Result']) {
                this.header('Result', result);
            }
        }
        /*
         * Convert a move from 0x88 coordinates to Standard Algebraic Notation
         * (SAN)
         *
         * @param {boolean} strict Use the strict SAN parser. It will throw errors
         * on overly disambiguated moves (see below):
         *
         * r1bqkbnr/ppp2ppp/2n5/1B1pP3/4P3/8/PPPP2PP/RNBQK1NR b KQkq - 2 4
         * 4. ... Nge7 is overly disambiguated because the knight on c6 is pinned
         * 4. ... Ne7 is technically the valid SAN
         */
        _moveToSan(move, moves) {
            let output = '';
            if (move.flags & BITS.KSIDE_CASTLE) {
                output = 'O-O';
            }
            else if (move.flags & BITS.QSIDE_CASTLE) {
                output = 'O-O-O';
            }
            else {
                if (move.piece !== PAWN) {
                    const disambiguator = getDisambiguator(move, moves);
                    output += move.piece.toUpperCase() + disambiguator;
                }
                if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
                    if (move.piece === PAWN) {
                        output += algebraic(move.from)[0];
                    }
                    output += 'x';
                }
                output += algebraic(move.to);
                if (move.promotion) {
                    output += '=' + move.promotion.toUpperCase();
                }
            }
            this._makeMove(move);
            if (this.isCheck()) {
                if (this.isCheckmate()) {
                    output += '#';
                }
                else {
                    output += '+';
                }
            }
            this._undoMove();
            return output;
        }
        // convert a move from Standard Algebraic Notation (SAN) to 0x88 coordinates
        _moveFromSan(move, strict = false) {
            // strip off any move decorations: e.g Nf3+?! becomes Nf3
            const cleanMove = strippedSan(move);
            let pieceType = inferPieceType(cleanMove);
            let moves = this._moves({ legal: true, piece: pieceType });
            // strict parser
            for (let i = 0, len = moves.length; i < len; i++) {
                if (cleanMove === strippedSan(this._moveToSan(moves[i], moves))) {
                    return moves[i];
                }
            }
            // the strict parser failed
            if (strict) {
                return null;
            }
            let piece = undefined;
            let matches = undefined;
            let from = undefined;
            let to = undefined;
            let promotion = undefined;
            /*
             * The default permissive (non-strict) parser allows the user to parse
             * non-standard chess notations. This parser is only run after the strict
             * Standard Algebraic Notation (SAN) parser has failed.
             *
             * When running the permissive parser, we'll run a regex to grab the piece, the
             * to/from square, and an optional promotion piece. This regex will
             * parse common non-standard notation like: Pe2-e4, Rc1c4, Qf3xf7,
             * f7f8q, b1c3
             *
             * NOTE: Some positions and moves may be ambiguous when using the permissive
             * parser. For example, in this position: 6k1/8/8/B7/8/8/8/BN4K1 w - - 0 1,
             * the move b1c3 may be interpreted as Nc3 or B1c3 (a disambiguated bishop
             * move). In these cases, the permissive parser will default to the most
             * basic interpretation (which is b1c3 parsing to Nc3).
             */
            let overlyDisambiguated = false;
            matches = cleanMove.match(/([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/
            //     piece         from              to       promotion
            );
            if (matches) {
                piece = matches[1];
                from = matches[2];
                to = matches[3];
                promotion = matches[4];
                if (from.length == 1) {
                    overlyDisambiguated = true;
                }
            }
            else {
                /*
                 * The [a-h]?[1-8]? portion of the regex below handles moves that may be
                 * overly disambiguated (e.g. Nge7 is unnecessary and non-standard when
                 * there is one legal knight move to e7). In this case, the value of
                 * 'from' variable will be a rank or file, not a square.
                 */
                matches = cleanMove.match(/([pnbrqkPNBRQK])?([a-h]?[1-8]?)x?-?([a-h][1-8])([qrbnQRBN])?/);
                if (matches) {
                    piece = matches[1];
                    from = matches[2];
                    to = matches[3];
                    promotion = matches[4];
                    if (from.length == 1) {
                        overlyDisambiguated = true;
                    }
                }
            }
            pieceType = inferPieceType(cleanMove);
            moves = this._moves({
                legal: true,
                piece: piece ? piece : pieceType,
            });
            for (let i = 0, len = moves.length; i < len; i++) {
                if (from && to) {
                    // hand-compare move properties with the results from our permissive regex
                    if ((!piece || piece.toLowerCase() == moves[i].piece) &&
                        Ox88[from] == moves[i].from &&
                        Ox88[to] == moves[i].to &&
                        (!promotion || promotion.toLowerCase() == moves[i].promotion)) {
                        return moves[i];
                    }
                    else if (overlyDisambiguated) {
                        /*
                         * SPECIAL CASE: we parsed a move string that may have an unneeded
                         * rank/file disambiguator (e.g. Nge7).  The 'from' variable will
                         */
                        const square = algebraic(moves[i].from);
                        if ((!piece || piece.toLowerCase() == moves[i].piece) &&
                            Ox88[to] == moves[i].to &&
                            (from == square[0] || from == square[1]) &&
                            (!promotion || promotion.toLowerCase() == moves[i].promotion)) {
                            return moves[i];
                        }
                    }
                }
            }
            return null;
        }
        ascii() {
            let s = '   +------------------------+\n';
            for (let i = Ox88.a8; i <= Ox88.h1; i++) {
                // display the rank
                if (file$5(i) === 0) {
                    s += ' ' + '87654321'[rank(i)] + ' |';
                }
                if (this._board[i]) {
                    const piece = this._board[i].type;
                    const color = this._board[i].color;
                    const symbol = color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
                    s += ' ' + symbol + ' ';
                }
                else {
                    s += ' . ';
                }
                if ((i + 1) & 0x88) {
                    s += '|\n';
                    i += 8;
                }
            }
            s += '   +------------------------+\n';
            s += '     a  b  c  d  e  f  g  h';
            return s;
        }
        perft(depth) {
            const moves = this._moves({ legal: false });
            let nodes = 0;
            const color = this._turn;
            for (let i = 0, len = moves.length; i < len; i++) {
                this._makeMove(moves[i]);
                if (!this._isKingAttacked(color)) {
                    if (depth - 1 > 0) {
                        nodes += this.perft(depth - 1);
                    }
                    else {
                        nodes++;
                    }
                }
                this._undoMove();
            }
            return nodes;
        }
        // pretty = external move object
        _makePretty(uglyMove) {
            const { color, piece, from, to, flags, captured, promotion } = uglyMove;
            let prettyFlags = '';
            for (const flag in BITS) {
                if (BITS[flag] & flags) {
                    prettyFlags += FLAGS[flag];
                }
            }
            const fromAlgebraic = algebraic(from);
            const toAlgebraic = algebraic(to);
            const move = {
                color,
                piece,
                from: fromAlgebraic,
                to: toAlgebraic,
                san: this._moveToSan(uglyMove, this._moves({ legal: true })),
                flags: prettyFlags,
                lan: fromAlgebraic + toAlgebraic,
                before: this.fen(),
                after: '',
            };
            // generate the FEN for the 'after' key
            this._makeMove(uglyMove);
            move.after = this.fen();
            this._undoMove();
            if (captured) {
                move.captured = captured;
            }
            if (promotion) {
                move.promotion = promotion;
                move.lan += promotion;
            }
            return move;
        }
        turn() {
            return this._turn;
        }
        board() {
            const output = [];
            let row = [];
            for (let i = Ox88.a8; i <= Ox88.h1; i++) {
                if (this._board[i] == null) {
                    row.push(null);
                }
                else {
                    row.push({
                        square: algebraic(i),
                        type: this._board[i].type,
                        color: this._board[i].color,
                    });
                }
                if ((i + 1) & 0x88) {
                    output.push(row);
                    row = [];
                    i += 8;
                }
            }
            return output;
        }
        squareColor(square) {
            if (square in Ox88) {
                const sq = Ox88[square];
                return (rank(sq) + file$5(sq)) % 2 === 0 ? 'light' : 'dark';
            }
            return null;
        }
        history({ verbose = false } = {}) {
            const reversedHistory = [];
            const moveHistory = [];
            while (this._history.length > 0) {
                reversedHistory.push(this._undoMove());
            }
            while (true) {
                const move = reversedHistory.pop();
                if (!move) {
                    break;
                }
                if (verbose) {
                    moveHistory.push(this._makePretty(move));
                }
                else {
                    moveHistory.push(this._moveToSan(move, this._moves()));
                }
                this._makeMove(move);
            }
            return moveHistory;
        }
        _pruneComments() {
            const reversedHistory = [];
            const currentComments = {};
            const copyComment = (fen) => {
                if (fen in this._comments) {
                    currentComments[fen] = this._comments[fen];
                }
            };
            while (this._history.length > 0) {
                reversedHistory.push(this._undoMove());
            }
            copyComment(this.fen());
            while (true) {
                const move = reversedHistory.pop();
                if (!move) {
                    break;
                }
                this._makeMove(move);
                copyComment(this.fen());
            }
            this._comments = currentComments;
        }
        getComment() {
            return this._comments[this.fen()];
        }
        setComment(comment) {
            this._comments[this.fen()] = comment.replace('{', '[').replace('}', ']');
        }
        deleteComment() {
            const comment = this._comments[this.fen()];
            delete this._comments[this.fen()];
            return comment;
        }
        getComments() {
            this._pruneComments();
            return Object.keys(this._comments).map((fen) => {
                return { fen: fen, comment: this._comments[fen] };
            });
        }
        deleteComments() {
            this._pruneComments();
            return Object.keys(this._comments).map((fen) => {
                const comment = this._comments[fen];
                delete this._comments[fen];
                return { fen: fen, comment: comment };
            });
        }
    }

    /* src/MoveViewer.svelte generated by Svelte v3.55.1 */
    const file$4 = "src/MoveViewer.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	child_ctx[14] = list;
    	child_ctx[15] = i;
    	return child_ctx;
    }

    // (93:2) {#if history != []}
    function create_if_block$1(ctx) {
    	let div;
    	let each_value = /*history*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "move-list svelte-1pf9wc2");
    			add_location(div, file$4, 93, 4, 1951);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*moveRefs, handleMove, history, scrollToSelectedMove, displayMove, currentIndex*/ 115) {
    				each_value = /*history*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(93:2) {#if history != []}",
    		ctx
    	});

    	return block;
    }

    // (98:10) {:else}
    function create_else_block(ctx) {
    	let button;
    	let t0_value = displayMove(/*move*/ ctx[13], /*index*/ ctx[15]) + "";
    	let t0;
    	let t1;
    	let index = /*index*/ ctx[15];
    	let mounted;
    	let dispose;
    	const assign_button = () => /*button_binding_1*/ ctx[9](button, index);
    	const unassign_button = () => /*button_binding_1*/ ctx[9](null, index);

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[10](/*index*/ ctx[15]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(button, "class", "almost-invisible svelte-1pf9wc2");
    			add_location(button, file$4, 98, 12, 2266);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			assign_button();

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*history*/ 1 && t0_value !== (t0_value = displayMove(/*move*/ ctx[13], /*index*/ ctx[15]) + "")) set_data_dev(t0, t0_value);

    			if (index !== /*index*/ ctx[15]) {
    				unassign_button();
    				index = /*index*/ ctx[15];
    				assign_button();
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			unassign_button();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(98:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (96:10) {#if index == currentIndex}
    function create_if_block_1(ctx) {
    	let button;
    	let t0_value = displayMove(/*move*/ ctx[13], /*index*/ ctx[15]) + "";
    	let t0;
    	let t1;
    	let index = /*index*/ ctx[15];
    	let mounted;
    	let dispose;
    	const assign_button = () => /*button_binding*/ ctx[7](button, index);
    	const unassign_button = () => /*button_binding*/ ctx[7](null, index);

    	function click_handler() {
    		return /*click_handler*/ ctx[8](/*index*/ ctx[15]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(button, "class", "almost-invisible-on svelte-1pf9wc2");
    			add_location(button, file$4, 96, 12, 2062);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			assign_button();

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*history*/ 1 && t0_value !== (t0_value = displayMove(/*move*/ ctx[13], /*index*/ ctx[15]) + "")) set_data_dev(t0, t0_value);

    			if (index !== /*index*/ ctx[15]) {
    				unassign_button();
    				index = /*index*/ ctx[15];
    				assign_button();
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			unassign_button();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(96:10) {#if index == currentIndex}",
    		ctx
    	});

    	return block;
    }

    // (95:6) {#each history as move, index}
    function create_each_block$1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*index*/ ctx[15] == /*currentIndex*/ ctx[4]) return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(95:6) {#each history as move, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let t0;
    	let button0;
    	let t2;
    	let button1;
    	let mounted;
    	let dispose;
    	let if_block = /*history*/ ctx[0] != [] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			button0 = element("button");
    			button0.textContent = "prev";
    			t2 = space();
    			button1 = element("button");
    			button1.textContent = "next";
    			add_location(button0, file$4, 103, 2, 2488);
    			add_location(button1, file$4, 104, 2, 2536);
    			add_location(div, file$4, 91, 0, 1919);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t0);
    			append_dev(div, button0);
    			append_dev(div, t2);
    			append_dev(div, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button0,
    						"click",
    						function () {
    							if (is_function(/*handleUndo*/ ctx[2])) /*handleUndo*/ ctx[2].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button1,
    						"click",
    						function () {
    							if (is_function(/*handleRedo*/ ctx[3])) /*handleRedo*/ ctx[3].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (/*history*/ ctx[0] != []) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(div, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function displayMove(move, index) {
    	if (index % 2 == 0) {
    		return parseInt(index / 2) + 1 + ". " + move.san;
    	} else {
    		return move.san;
    	}
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MoveViewer', slots, []);
    	let chess = new Chess();
    	let { history = [] } = $$props;
    	let { handleMove } = $$props;
    	let { handleUndo } = $$props;
    	let { handleRedo } = $$props;
    	let { currentIndex } = $$props;
    	let moveRefs = [];

    	onMount(() => {
    		window.addEventListener('keydown', handleGlobalKeyDown);
    		scrollToSelectedMove();
    	});

    	afterUpdate(() => {
    		window.removeEventListener('keydown', handleGlobalKeyDown);
    		scrollToSelectedMove();
    	});

    	function handleGlobalKeyDown(event) {
    		if (event.key === 'ArrowLeft') {
    			handleUndo();
    		}

    		if (event.key === 'ArrowRight') {
    			handleRedo();
    		}
    	}

    	function scrollToSelectedMove() {
    		if (moveRefs[currentIndex]) {
    			moveRefs[currentIndex].scrollIntoView({
    				behavior: 'smooth',
    				block: 'center',
    				inline: 'nearest'
    			});
    		}
    	}

    	$$self.$$.on_mount.push(function () {
    		if (handleMove === undefined && !('handleMove' in $$props || $$self.$$.bound[$$self.$$.props['handleMove']])) {
    			console.warn("<MoveViewer> was created without expected prop 'handleMove'");
    		}

    		if (handleUndo === undefined && !('handleUndo' in $$props || $$self.$$.bound[$$self.$$.props['handleUndo']])) {
    			console.warn("<MoveViewer> was created without expected prop 'handleUndo'");
    		}

    		if (handleRedo === undefined && !('handleRedo' in $$props || $$self.$$.bound[$$self.$$.props['handleRedo']])) {
    			console.warn("<MoveViewer> was created without expected prop 'handleRedo'");
    		}

    		if (currentIndex === undefined && !('currentIndex' in $$props || $$self.$$.bound[$$self.$$.props['currentIndex']])) {
    			console.warn("<MoveViewer> was created without expected prop 'currentIndex'");
    		}
    	});

    	const writable_props = ['history', 'handleMove', 'handleUndo', 'handleRedo', 'currentIndex'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MoveViewer> was created with unknown prop '${key}'`);
    	});

    	function button_binding($$value, index) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			moveRefs[index] = $$value;
    			$$invalidate(5, moveRefs);
    		});
    	}

    	const click_handler = index => {
    		handleMove(index, history);
    		scrollToSelectedMove();
    	};

    	function button_binding_1($$value, index) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			moveRefs[index] = $$value;
    			$$invalidate(5, moveRefs);
    		});
    	}

    	const click_handler_1 = index => {
    		handleMove(index, history);
    		scrollToSelectedMove();
    	};

    	$$self.$$set = $$props => {
    		if ('history' in $$props) $$invalidate(0, history = $$props.history);
    		if ('handleMove' in $$props) $$invalidate(1, handleMove = $$props.handleMove);
    		if ('handleUndo' in $$props) $$invalidate(2, handleUndo = $$props.handleUndo);
    		if ('handleRedo' in $$props) $$invalidate(3, handleRedo = $$props.handleRedo);
    		if ('currentIndex' in $$props) $$invalidate(4, currentIndex = $$props.currentIndex);
    	};

    	$$self.$capture_state = () => ({
    		writable,
    		Chess,
    		onMount,
    		afterUpdate,
    		chess,
    		history,
    		handleMove,
    		handleUndo,
    		handleRedo,
    		currentIndex,
    		displayMove,
    		moveRefs,
    		handleGlobalKeyDown,
    		scrollToSelectedMove
    	});

    	$$self.$inject_state = $$props => {
    		if ('chess' in $$props) chess = $$props.chess;
    		if ('history' in $$props) $$invalidate(0, history = $$props.history);
    		if ('handleMove' in $$props) $$invalidate(1, handleMove = $$props.handleMove);
    		if ('handleUndo' in $$props) $$invalidate(2, handleUndo = $$props.handleUndo);
    		if ('handleRedo' in $$props) $$invalidate(3, handleRedo = $$props.handleRedo);
    		if ('currentIndex' in $$props) $$invalidate(4, currentIndex = $$props.currentIndex);
    		if ('moveRefs' in $$props) $$invalidate(5, moveRefs = $$props.moveRefs);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		history,
    		handleMove,
    		handleUndo,
    		handleRedo,
    		currentIndex,
    		moveRefs,
    		scrollToSelectedMove,
    		button_binding,
    		click_handler,
    		button_binding_1,
    		click_handler_1
    	];
    }

    class MoveViewer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			history: 0,
    			handleMove: 1,
    			handleUndo: 2,
    			handleRedo: 3,
    			currentIndex: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MoveViewer",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get history() {
    		throw new Error("<MoveViewer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set history(value) {
    		throw new Error("<MoveViewer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleMove() {
    		throw new Error("<MoveViewer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handleMove(value) {
    		throw new Error("<MoveViewer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleUndo() {
    		throw new Error("<MoveViewer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handleUndo(value) {
    		throw new Error("<MoveViewer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleRedo() {
    		throw new Error("<MoveViewer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handleRedo(value) {
    		throw new Error("<MoveViewer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get currentIndex() {
    		throw new Error("<MoveViewer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentIndex(value) {
    		throw new Error("<MoveViewer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
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
    const file$3 = "node_modules/svelte-canvas/dist/components/Canvas.svelte";

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
    			add_location(canvas_1, file$3, 75, 0, 2230);
    			set_style(div, "display", `none`);
    			add_location(div, file$3, 150, 0, 4221);
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
    const file$2 = "node_modules/svelte-canvas/dist/components/Layer.svelte";

    function create_fragment$3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "data-layer-id", /*layerId*/ ctx[0]);
    			add_location(div, file$2, 11, 0, 416);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
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

    let frame;
    const now = Date.now();
    const start$1 = (set) => {
        set(Date.now() - now);
        frame = window.requestAnimationFrame(() => start$1(set));
        return () => window.cancelAnimationFrame(frame);
    };
    function noop() {
    }
    readable(Date.now() - now, typeof window === 'undefined' ? noop : start$1);

    const squareSize = 20;

    function FENtoBoard (FEN) {
      let board = FEN.split(' ')[0].split('/');
      board.forEach(function (item, i) {
        board[i] = item.replace(/[1]/, '_');
        board[i] = board[i].replace(/[2]/, '__');
        board[i] = board[i].replace(/[3]/, '___');
        board[i] = board[i].replace(/[4]/, '____');
        board[i] = board[i].replace(/[5]/, '_____');
        board[i] = board[i].replace(/[6]/, '______');
        board[i] = board[i].replace(/[7]/, '_______');
        board[i] = board[i].replace(/[8]/, '________');
      });
      board = board.join('').split('');
      board.forEach(function (item, i) {
        board[i] = [item, Math.floor(i / 8), i % 8];
      });
      return board
    }

    function pgnToFen (pgnMoves, fen) {
      let board = fen.split(' ')[0];
      let activeColor = fen.split(' ')[1];
      let castleAvailability = fen.split(' ')[2];
      let enPassantTarget = fen.split(' ')[3];
      const halfMoveClock = fen.split(' ')[4];
      let fullMoveNumber = fen.split(' ')[5];

      const pieces = {
        p: 'wp',
        n: 'wn',
        b: 'wb',
        r: 'wr',
        q: 'wq',
        k: 'wk',
        P: 'bp',
        N: 'bn',
        B: 'bb',
        R: 'br',
        Q: 'bq',
        K: 'bk'
      };

      for (const move of pgnMoves.split(' ')) {
        if (!isNaN(parseInt(move[0]))) {
          // This is a move number, skip it
          continue
        } else if (move === 'O-O') {
          // King-side castle
          if (activeColor === 'w') {
            board = board.replace('e1', '-k-').replace('h1', '--r-');
          } else {
            board = board.replace('e8', '-k-').replace('h8', '--r-');
          }
          castleAvailability.replace(activeColor, '');
          castleAvailability.replace('-', '');
          if (castleAvailability === '') {
            castleAvailability = '-';
          }
          if (activeColor === 'w') {
            activeColor = 'b';
          } else {
            activeColor = 'w';
            fullMoveNumber++;
          }
        } else if (move === 'O-O-O') {
          // Queen-side castle
          if (activeColor === 'w') {
            board = board.replace('e1', '-k-').replace('a1', '---r');
          } else {
            board = board.replace('e8', '-k-').replace('a8', '---r');
          }
          castleAvailability.replace(activeColor, '');
          castleAvailability.replace('-', '');
          if (castleAvailability === '') {
            castleAvailability = '-';
          }
          if (activeColor === 'w') {
            activeColor = 'b';
            fullMoveNumber++;
          } else {
            activeColor = 'w';
          }
        } else {
          // Normal move
          const piece = move[0];
          const from = move.substr(1, 2);
          const to = move.substr(3, 2);
          const captured = move.includes('x') ? 'x' : '';
          board = board.replace(from, captured + '-').replace(to, pieces[piece]);
          if (piece.toLowerCase() === 'p' && Math.abs(to[1] - from[1]) === 2) {
            enPassantTarget = `${from[0]}${
          (parseInt(from[1]) + parseInt(to[1])) / 2
        }`;
          } else {
            enPassantTarget = '-';
          }
          castleAvailability.replace(activeColor, '');
          if (piece.toLowerCase() === 'k') {
            castleAvailability.replace('-', '');
          }
          if (castleAvailability === '') {
            castleAvailability = '-';
          }
          if (activeColor === 'w') {
            activeColor = 'b';
            fullMoveNumber++;
          } else {
            activeColor = 'w';
          }
        }
      }
      return `${board} ${activeColor} ${castleAvailability} ${enPassantTarget} ${halfMoveClock} ${fullMoveNumber}`
    }

    const EXAMPLE_PGN = '1. e4';
    const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    // console.log("yaa")

    // FEN -> pieces,

    // (FEN,PNG command) -> FEN

    const start = 'rnbqkbnr'.split('');

    const pieces = [0, 1].flatMap((index) => {
      return start
        .map((piece, file) => {
          return [`${piece}`, file, index ? 7 : 0]
        })
        .concat(start.map((_, file) => ['P', file, index ? 6 : 1]))
    });

    var chess_utils = {
      FENtoBoard,
      pgnToFen,
      EXAMPLE_PGN,
      START_FEN,
      pieces,
      squareSize
    };

    /* src/Piece.svelte generated by Svelte v3.55.1 */
    const file$1 = "src/Piece.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*image_url*/ ctx[1])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*name*/ ctx[0]);
    			attr_dev(img, "class", "svelte-1ulxvq5");
    			add_location(img, file$1, 45, 2, 1531);
    			attr_dev(div, "class", "piece svelte-1ulxvq5");
    			add_location(div, file$1, 44, 0, 1509);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*image_url*/ 2 && !src_url_equal(img.src, img_src_value = /*image_url*/ ctx[1])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*name*/ 1) {
    				attr_dev(img, "alt", /*name*/ ctx[0]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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
    	'_': 'https://upload.wikimedia.org/wikipedia/commons/1/1d/No_image.svg'
    };

    // Preload images
    for (const name in images) {
    	new Image().src = images[name];
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Piece', slots, []);
    	let { name } = $$props;
    	let image_url;

    	$$self.$$.on_mount.push(function () {
    		if (name === undefined && !('name' in $$props || $$self.$$.bound[$$self.$$.props['name']])) {
    			console.warn("<Piece> was created without expected prop 'name'");
    		}
    	});

    	const writable_props = ['name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Piece> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({
    		images,
    		Layer,
    		squareSize: chess_utils.squareSize,
    		name,
    		image_url
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('image_url' in $$props) $$invalidate(1, image_url = $$props.image_url);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*name*/ 1) {
    			// Update image_url reactively whenever 'name' changes
    			{
    				$$invalidate(1, image_url = images[name]);
    			}
    		}
    	};

    	return [name, image_url];
    }

    class Piece extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Piece",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get name() {
    		throw new Error("<Piece>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Piece>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function flip(node, { from, to }, params = {}) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const [ox, oy] = style.transformOrigin.split(' ').map(parseFloat);
        const dx = (from.left + from.width * ox / to.width) - (to.left + ox);
        const dy = (from.top + from.height * oy / to.height) - (to.top + oy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(Math.sqrt(dx * dx + dy * dy)) : duration,
            easing,
            css: (t, u) => {
                const x = u * dx;
                const y = u * dy;
                const sx = t + u * from.width / to.width;
                const sy = t + u * from.height / to.height;
                return `transform: ${transform} translate(${x}px, ${y}px) scale(${sx}, ${sy});`;
            }
        };
    }

    /* src/Board.svelte generated by Svelte v3.55.1 */

    const { console: console_1 } = globals;
    const file = "src/Board.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	child_ctx[24] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	child_ctx[27] = i;
    	return child_ctx;
    }

    // (267:0) {#if debug}
    function create_if_block(ctx) {
    	let input0;
    	let t0;
    	let button0;
    	let t2;
    	let input1;
    	let t3;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input0 = element("input");
    			t0 = space();
    			button0 = element("button");
    			button0.textContent = "Load FEN";
    			t2 = space();
    			input1 = element("input");
    			t3 = space();
    			button1 = element("button");
    			button1.textContent = "Load PGN";
    			attr_dev(input0, "placeholder", "Enter FEN");
    			add_location(input0, file, 267, 2, 6354);
    			add_location(button0, file, 268, 2, 6407);
    			attr_dev(input1, "placeholder", "Enter PGN");
    			add_location(input1, file, 271, 2, 6460);
    			add_location(button1, file, 272, 2, 6513);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input0, anchor);
    			set_input_value(input0, /*fen*/ ctx[2]);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, input1, anchor);
    			set_input_value(input1, /*pgn*/ ctx[0]);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, button1, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[16]),
    					listen_dev(button0, "click", /*loadFEN*/ ctx[9], false, false, false),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[17]),
    					listen_dev(button1, "click", /*loadPGN*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*fen*/ 4 && input0.value !== /*fen*/ ctx[2]) {
    				set_input_value(input0, /*fen*/ ctx[2]);
    			}

    			if (dirty & /*pgn*/ 1 && input1.value !== /*pgn*/ ctx[0]) {
    				set_input_value(input1, /*pgn*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(input1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(267:0) {#if debug}",
    		ctx
    	});

    	return block;
    }

    // (280:6) {#each letters as letter, col}
    function create_each_block_1(ctx) {
    	let div;
    	let piece;
    	let t;
    	let div_key_value;
    	let div_transition;
    	let current;

    	piece = new Piece({
    			props: {
    				name: /*boardValue*/ ctx[5][/*row*/ ctx[24]][/*col*/ ctx[27]]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(piece.$$.fragment);
    			t = space();

    			attr_dev(div, "class", "cell " + (/*col*/ ctx[27] % 2 === /*row*/ ctx[24] % 2
    			? 'white'
    			: 'black') + " svelte-lz2d3f");

    			attr_dev(div, "data-coordinate", "" + (/*letter*/ ctx[25] + /*number*/ ctx[22]));
    			attr_dev(div, "key", div_key_value = "" + (/*letter*/ ctx[25] + /*number*/ ctx[22] + /*boardValue*/ ctx[5][/*row*/ ctx[24]][/*col*/ ctx[27]]));
    			add_location(div, file, 280, 8, 6725);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(piece, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const piece_changes = {};
    			if (dirty & /*boardValue*/ 32) piece_changes.name = /*boardValue*/ ctx[5][/*row*/ ctx[24]][/*col*/ ctx[27]];
    			piece.$set(piece_changes);

    			if (!current || dirty & /*boardValue*/ 32 && div_key_value !== (div_key_value = "" + (/*letter*/ ctx[25] + /*number*/ ctx[22] + /*boardValue*/ ctx[5][/*row*/ ctx[24]][/*col*/ ctx[27]]))) {
    				attr_dev(div, "key", div_key_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(piece.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, flip, { duration: 1000 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(piece.$$.fragment, local);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, flip, { duration: 1000 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(piece);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(280:6) {#each letters as letter, col}",
    		ctx
    	});

    	return block;
    }

    // (279:4) {#each numbers as number, row}
    function create_each_block(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = /*letters*/ ctx[7];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*letters, numbers, boardValue*/ 416) {
    				each_value_1 = /*letters*/ ctx[7];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(279:4) {#each numbers as number, row}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let t0;
    	let div2;
    	let div1;
    	let div0;
    	let t1;
    	let moveviewer;
    	let current;
    	let if_block = /*debug*/ ctx[1] && create_if_block(ctx);
    	let each_value = /*numbers*/ ctx[8];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	moveviewer = new MoveViewer({
    			props: {
    				history: /*history*/ ctx[4],
    				handleMove: /*handleMove*/ ctx[11],
    				handleUndo: /*handleUndo*/ ctx[12],
    				handleRedo: /*handleRedo*/ ctx[13],
    				currentIndex: /*currentIndex*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			create_component(moveviewer.$$.fragment);
    			attr_dev(div0, "class", "board svelte-lz2d3f");
    			add_location(div0, file, 277, 2, 6625);
    			attr_dev(div1, "class", "board-wrapper svelte-lz2d3f");
    			add_location(div1, file, 276, 0, 6595);
    			attr_dev(div2, "class", "chess-container svelte-lz2d3f");
    			add_location(div2, file, 275, 0, 6565);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div2, t1);
    			mount_component(moveviewer, div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*debug*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(t0.parentNode, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*letters, numbers, boardValue*/ 416) {
    				each_value = /*numbers*/ ctx[8];
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
    						each_blocks[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const moveviewer_changes = {};
    			if (dirty & /*history*/ 16) moveviewer_changes.history = /*history*/ ctx[4];
    			if (dirty & /*currentIndex*/ 8) moveviewer_changes.currentIndex = /*currentIndex*/ ctx[3];
    			moveviewer.$set(moveviewer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(moveviewer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(moveviewer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    			destroy_component(moveviewer);
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

    function validateFEN(fen) {
    	const fenParts = fen.split(" ");

    	if (fenParts.length !== 6) {
    		return false;
    	}

    	const [position, activeColor, castling, enPassant, halfMove, fullMove] = fenParts;

    	// Check position
    	const rows = position.split("/");

    	if (rows.length !== 8) {
    		return false;
    	}

    	for (const row of rows) {
    		let rowCount = 0;

    		for (const char of row) {
    			if (isNaN(parseInt(char))) {
    				if (!("prnbqkPRNBQK").includes(char)) {
    					return false;
    				}

    				rowCount += 1;
    			} else {
    				rowCount += parseInt(char);
    			}
    		}

    		if (rowCount !== 8) {
    			return false;
    		}
    	}

    	// Check active color
    	if (!["w", "b"].includes(activeColor)) {
    		return false;
    	}

    	// Check castling availability
    	if (!(/^(KQ?k?q?|Qk?q?|kq?|q|-)$/).test(castling)) {
    		return false;
    	}

    	// Check en passant target square
    	if (!(/^(?:(?:[a-h][36])|-)$/).test(enPassant)) {
    		return false;
    	}

    	// Check halfmove clock and fullmove number
    	if (isNaN(halfMove) || isNaN(fullMove)) {
    		return false;
    	}

    	return true;
    }

    /**
     * Converts a FEN string to a 2D array representing the board.
     * @param {string} fen - The FEN string.
     * @returns {Array<Array<string>>} A 2D array representing the board.
     */
    function fenToBoard(fen) {
    	const [position] = fen.split(" ");
    	const rows = position.split("/");

    	const board = rows.map(row => {
    		const newRow = [];

    		for (const char of row) {
    			if (isNaN(parseInt(char))) {
    				newRow.push(char);
    			} else {
    				newRow.push(...Array(parseInt(char)).fill('_'));
    			}
    		}

    		return newRow;
    	});

    	return board;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $board;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Board', slots, []);
    	let { startingPositionFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" } = $$props;
    	let { pgn = "" } = $$props;
    	let { debug = false } = $$props;
    	let fen = "";
    	let key = 0;
    	let currentIndex = 0;
    	let board = writable(fenToBoard(startingPositionFEN));
    	validate_store(board, 'board');
    	component_subscribe($$self, board, value => $$invalidate(15, $board = value));
    	let history = [];
    	let boardValue;

    	board.subscribe(value => {
    		$$invalidate(5, boardValue = value);
    	});

    	let chess = new Chess();
    	let letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
    	let numbers = [8, 7, 6, 5, 4, 3, 2, 1];

    	/**
     * Loads a PGN string and updates the board with the resulting position.
     */
    	function loadFEN() {
    		if (validateFEN(fen)) {
    			chess.load(fen);
    			board.set(fenToBoard(fen));
    			console.log(board);
    			console.log(boardValue);
    			key += 1;
    		} else {
    			console.error("Invalid FEN:", fen);
    		}
    	}

    	/**
     * Parses a PGN string into an array of moves.
     * @param {string} pgn - The PGN string.
     * @returns {Array<string>} An array of moves.
     */
    	function loadPGN() {
    		chess.loadPgn(pgn); // Load the PGN using chess.js
    		$$invalidate(4, history = chess.history({ verbose: true })); // Get the move history
    		$$invalidate(3, currentIndex = history.length); // Set the current index to the end of the history
    		console.log(history);
    		updateBoard(history); // Update the board using the move history
    	}

    	function handleMove(moveIndex, history) {
    		// Reset the chess object to the initial position
    		chess.reset();

    		// Apply each move in the history array up to moveIndex (exclusive)
    		for (let i = 0; i < moveIndex; i++) {
    			const move = history[i];
    			const result = chess.move(move);

    			if (!result) {
    				console.error("Invalid move:", move);
    				break;
    			}
    		}

    		$$invalidate(3, currentIndex = moveIndex);

    		// Update the board's position based on the chess object's FEN
    		board.set(fenToBoard(chess.fen()));
    	}

    	function handleUndo() {
    		$$invalidate(3, currentIndex -= 1);

    		if (currentIndex < 0) {
    			$$invalidate(3, currentIndex = 0);
    		}

    		handleMove(currentIndex, history);
    	}

    	function handleRedo() {
    		$$invalidate(3, currentIndex += 1);

    		if (currentIndex > history.length) {
    			$$invalidate(3, currentIndex = history.length);
    		}

    		handleMove(currentIndex, history);
    	}

    	function handleGlobalKeyDown(event) {
    		if (event.key === 'ArrowLeft') {
    			handleUndo();
    		}

    		if (event.key === 'ArrowRight') {
    			handleRedo();
    		}
    	}

    	onMount(() => {
    		window.addEventListener('keydown', handleGlobalKeyDown);
    		loadPGN();
    	});

    	onDestroy(() => {
    		window.removeEventListener('keydown', handleGlobalKeyDown);
    	});

    	/**
     * Updates the board position based on an array of moves.
     * @param {Array<string>} moves - An array of moves to apply.
     */
    	function updateBoard(moves) {
    		// Reset the chess object to the initial position
    		chess.reset();

    		if (!Array.isArray(moves)) {
    			console.error("Invalid moves array:", moves);
    			return;
    		}

    		// Apply each move in the moves array
    		for (const move of moves) {
    			const result = chess.move(move);

    			if (!result) {
    				console.error("Invalid move:", move);
    				break;
    			}
    		}

    		// Update the board's position based on the chess object's FEN
    		const newFen = chess.fen();

    		board.set(fenToBoard(newFen));
    	}

    	const writable_props = ['startingPositionFEN', 'pgn', 'debug'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Board> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		fen = this.value;
    		$$invalidate(2, fen);
    	}

    	function input1_input_handler() {
    		pgn = this.value;
    		$$invalidate(0, pgn);
    	}

    	$$self.$$set = $$props => {
    		if ('startingPositionFEN' in $$props) $$invalidate(14, startingPositionFEN = $$props.startingPositionFEN);
    		if ('pgn' in $$props) $$invalidate(0, pgn = $$props.pgn);
    		if ('debug' in $$props) $$invalidate(1, debug = $$props.debug);
    	};

    	$$self.$capture_state = () => ({
    		MoveViewer,
    		Piece,
    		Canvas,
    		Chess,
    		writable,
    		onMount,
    		onDestroy,
    		flip,
    		startingPositionFEN,
    		pgn,
    		debug,
    		fen,
    		key,
    		currentIndex,
    		board,
    		history,
    		boardValue,
    		chess,
    		letters,
    		numbers,
    		validateFEN,
    		loadFEN,
    		loadPGN,
    		fenToBoard,
    		handleMove,
    		handleUndo,
    		handleRedo,
    		handleGlobalKeyDown,
    		updateBoard,
    		$board
    	});

    	$$self.$inject_state = $$props => {
    		if ('startingPositionFEN' in $$props) $$invalidate(14, startingPositionFEN = $$props.startingPositionFEN);
    		if ('pgn' in $$props) $$invalidate(0, pgn = $$props.pgn);
    		if ('debug' in $$props) $$invalidate(1, debug = $$props.debug);
    		if ('fen' in $$props) $$invalidate(2, fen = $$props.fen);
    		if ('key' in $$props) key = $$props.key;
    		if ('currentIndex' in $$props) $$invalidate(3, currentIndex = $$props.currentIndex);
    		if ('board' in $$props) $$invalidate(6, board = $$props.board);
    		if ('history' in $$props) $$invalidate(4, history = $$props.history);
    		if ('boardValue' in $$props) $$invalidate(5, boardValue = $$props.boardValue);
    		if ('chess' in $$props) chess = $$props.chess;
    		if ('letters' in $$props) $$invalidate(7, letters = $$props.letters);
    		if ('numbers' in $$props) $$invalidate(8, numbers = $$props.numbers);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$board*/ 32768) {
    			{
    				$$invalidate(5, boardValue = $board);
    			}
    		}
    	};

    	return [
    		pgn,
    		debug,
    		fen,
    		currentIndex,
    		history,
    		boardValue,
    		board,
    		letters,
    		numbers,
    		loadFEN,
    		loadPGN,
    		handleMove,
    		handleUndo,
    		handleRedo,
    		startingPositionFEN,
    		$board,
    		input0_input_handler,
    		input1_input_handler
    	];
    }

    class Board extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			startingPositionFEN: 14,
    			pgn: 0,
    			debug: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Board",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get startingPositionFEN() {
    		throw new Error("<Board>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set startingPositionFEN(value) {
    		throw new Error("<Board>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pgn() {
    		throw new Error("<Board>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pgn(value) {
    		throw new Error("<Board>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get debug() {
    		throw new Error("<Board>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set debug(value) {
    		throw new Error("<Board>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.55.1 */

    function create_fragment(ctx) {
    	let board;
    	let current;

    	board = new Board({
    			props: {
    				pgn: `1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 {This opening is called the Ruy Lopez.}
4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7
11. c4 c6 12. cxb5 axb5 13. Nc3 Bb7 14. Bg5 b4 15. Nb1 h6 16. Bh4 c5 17. dxe5
Nxe4 18. Bxe7 Qxe7 19. exd6 Qf6 20. Nbd2 Nxd6 21. Nc4 Nxc4 22. Bxc4 Nb6
23. Ne5 Rae8 24. Bxf7+ Rxf7 25. Nxf7 Rxe1+ 26. Qxe1 Kxf7 27. Qe3 Qg5 28. Qxg5
hxg5 29. b3 Ke6 30. a3 Kd6 31. axb4 cxb4 32. Ra5 Nd5 33. f3 Bc8 34. Kf2 Bf5
35. Ra7 g6 36. Ra6+ Kc5 37. Ke1 Nf4 38. g3 Nxh3 39. Kd2 Kb5 40. Rd6 Kc5 41. Ra6
Nf2 42. g4 Bd3 43. Re6 1/2-1/2`
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(board.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(board, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(board.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(board.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(board, detaching);
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

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Board });
    	return [];
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

    const app = new App({
      target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
