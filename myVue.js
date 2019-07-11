class Vue {
    constructor({el, template, data, computed, created = () => {}}) {
        this.$el = document.querySelector(el);
        this.caller = {};
        this.dealData(data);
        this.dealComputed(computed);
        this.callerName = '';

        this.template = template;
        created.bind(this)();
        this.render();
    }
    dealComputed(computed) {
        for(let key in computed) {
            if (computed.hasOwnProperty(key)) {
                let computedCallbackName = '_computed_' + key;
                let fn = (() => {
                    this[key] = computed[key].bind(this)();
                });
                this[computedCallbackName] = fn;
                this.callerName = computedCallbackName;
                fn();
            }
        }
    }
    dealData(data) {
        for(let key in data) {
            if (data.hasOwnProperty(key)) {
                this[key] = data[key];
                Object.defineProperty(this, key, {
                    get() {
                        if (!this.caller[key]) {
                            this.caller[key] = new Set([]);
                        }
                        this.caller[key].add(this.callerName);
                        return data[key];
                    },
                    set(newValue) {
                        data[key] = newValue;
                        if (this.caller[key]) {
                            this.caller[key].forEach(name => {
                                console.log(name);
                                this[name]();
                            });
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
            }
        }
    }
    render() {
        let html = this.template.replace(/{{.+?}}/g, (str) => {
            let key = str.replace(/{{|}}/g, '');

            this.callerName = 'render';
            return this[key];
        });
        this.$el.innerHTML = html;
    }
}
