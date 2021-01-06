import { updateDate } from "@/redux/actions";
import { $ } from "core/dom";
import { Emitter } from "core/Emitter";
import { StoreSubscriber } from "core/StoreSubscriber";

export class Excel {
    constructor(options = {}) {
        this.components = options.components || [];
        this.store = options.store;
        this.emitter = new Emitter();
        this.subscriber = new StoreSubscriber(this.store);
    }

    getRoot() {
        const $root = $.create("div", "excel");
        const componentOptions = {
            store: this.store,
            emitter: this.emitter,
        };

        this.components = this.components.map(Component => {
            const $el = $.create("div", Component.className);
            const component = new Component($el, componentOptions);
            $el.html(component.toHTML());
            $root.append($el);
            return component;
        });
        return $root;
    }

    init() {
        this.store.dispatch(updateDate());
        this.subscriber.subscribeComponents(this.components);
        this.components.forEach(comp => comp.init());
    }

    destroy() {
        this.subscriber.unsubscribeFromStore();
        this.components.forEach(comp => comp.destroy());
    }
}