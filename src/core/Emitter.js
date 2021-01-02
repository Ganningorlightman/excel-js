export class Emitter {
    constructor() {
        this.listeners = {};
    }

    emit(event, ...args) {
        if (!Array.isArray(this.listeners[event])) return false;
        this.listeners[event].forEach(listener => {
            listener(...args);
        });
        return true;
    }

    subscribe(event, fn) {
        this.listeners[event] = this.listeners[event] || [];
        this.listeners[event].push(fn);
        return () => {
            this.listeners[event] =
                this.listeners[event].filter(listener => listener !== fn);
        };
    }
}

// const emitter = new Emitter();
// const unsub = emitter.subscribe("Alex", data => console.log("Sub:", data));
// emitter.emit("Alex", "test");
// setTimeout(() => {
//     emitter.emit("Alex", "after 2 seconds");
// }, 2000);
// setTimeout(() => {
//     unsub();
// }, 3000);
// setTimeout(() => {
//     emitter.emit("Alex", "after 4 seconds");
// }, 4000);