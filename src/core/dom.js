class Dom {
    constructor(selector) {
        this.$el = typeof selector === "string" ? document.querySelector(selector) : selector;
    }

    get data() {
        return this.$el.dataset;
    }

    id(parse) {
        if (parse) {
            const parsed = this.id().split(":");
            return {
                row: +parsed[0],
                col: +parsed[1],
            };
        }
        return this.data.id;
    }

    html(html) {
        if (typeof html === "string") {
            this.$el.innerHTML = html;
            return this;
        }
        return this.$el.outerHTML.trim();
    }

    clear() {
        this.html("");
        return this;
    }

    text(txt) {
        if (typeof txt !== "undefined") {
            this.$el.textContent = txt;
            return this;
        }
        if (this.$el.tagName.toLowerCase() === "input") {
            return this.$el.value.trim();
        }
        return this.$el.textContent.trim();
    }

    on(eventType, callback) {
        this.$el.addEventListener(eventType, callback);
    }

    off(eventType, callback) {
        this.$el.removeEventListener(eventType, callback);
    }

    append(node) {
        if (node instanceof Dom) {
            node = node.$el;
        }
        if (Element.prototype.append) {
            this.$el.append(node);
        } else {
            this.$el.appendChild(node);
        }
        return this;
    }

    closest(selector) {
        return $(this.$el.closest(selector));
    }

    getCoords() {
        return this.$el.getBoundingClientRect();
    }

    focus() {
        this.$el.focus();
        return this;
    }

    find(selector) {
        return $(this.$el.querySelector(selector));
    }

    findAll(selector) {
        return this.$el.querySelectorAll(selector);
    }

    attr(name, value) {
        if (value) {
            this.$el.setAttribute(name, value);
            return this;
        }
        return this.$el.getAttribute(name);
    }

    css(styles = {}) {
        for (const [property, value] of Object.entries(styles)) {
            this.$el.style[property] = value;
        }
    }

    getStyles(styles = []) {
        return styles.reduce((res, s) => {
            res[s] = this.$el.style[s];
            return res;
        }, {});
    }

    addClass(className) {
        this.$el.classList.add(className);
        return this;
    }

    removeClass(className) {
        this.$el.classList.remove(className);
        return this;
    }
}

export function $(selector) {
    return new Dom(selector);
}

$.create = (tagName, classes = "") => {
    const el = document.createElement(tagName);
    if (classes) {
        el.classList.add(classes);
    }
    return $(el);
};
