class Vue {
    constructor(
        {
            el = '',
            template = '',
            data = {},
            computed = {},
            methods = {},
            created = () => {},
            mounted = () => {}
        }
    ) {
        this.$el = document.querySelector(el);
        // 依赖收集器: 存储依赖的回调函数
        this.caller = {};

        this.dealData(data);
        this.dealComputed(computed);
        this.dealMethods(methods);

        // 读取字段时的回调函数名
        this.callerName = '';
        // 异步任务集合
        this.taskList = new Set([]);
        this.timeId = 0;

        this.template = template;

        created.bind(this)();
        this.render();
        mounted.bind(this)();
    }
    dealComputed(computed) {
        for(let key in computed) {
            if (computed.hasOwnProperty(key)) {
                // 回调函数名
                let computedCallbackName = '_computed_' + key;
                // 回调函数值
                let fn = (() => {
                    this[key] = computed[key].bind(this)();
                });
                this[computedCallbackName] = fn;
                // 读取值之前设置callerName
                this.callerName = computedCallbackName;
                fn();
            }
        }
    }
    dealMethods(methods) {
        for(let key in methods) {
            if (methods.hasOwnProperty(key)) {
                this[key] = methods[key];
                // 事件展示通过dom显示绑定, 需要把回调函数放到window下
                window['myVue_' + key] = methods[key].bind(this);
            }
        }
    }
    // 向特定字段下加入依赖它的回调函数
    addCallback(key) {
        if (!this.caller[key]) {
            this.caller[key] = new Set([]);
        }
        this.caller[key].add(this.callerName);
    }

    dealData(data) {
        for(let key in data) {
            if (data.hasOwnProperty(key)) {
                this[key] = data[key];
                Object.defineProperty(this, key, {
                    // 读取属性时将调用者name保存到依赖收集器中
                    get() {
                        this.addCallback(key);
                        return data[key];
                    },
                    // 设置属性时, 执行依赖它的回调函数
                    set(newValue) {
                        data[key] = newValue;
                        if (this.caller[key]) {
                            this.caller[key].forEach(name => {
                                // 放到任务列表中,避免无用的重复执行
                                this.taskList.add(this[name]);
                                this.toExecTask();
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
        // 替换{{}}
        let html = this.template.replace(/{{.+?}}/g, (str) => {
            let key = str.replace(/{{|}}/g, '');
            this.callerName = 'render';
            return this[key];
        });
        // 替换v-on
        html = html.replace(/v-on:.+?=".+?"/g, (str) => {
            console.log(str);
            let eventName = str.split('v-on:')[1].split('=')[0]
            let callbackName = str.split('"')[1];
            return `on${eventName}=myVue_${callbackName}()`;
        });
        this.$el.innerHTML = html;
    }
    // 执行并清空任务队列
    execTask() {
        this.taskList.forEach(fn => {
            fn.bind(this)();
        });
        this.taskList = new Set([]);
    }
    $nextTick(cb) {
        this.timeId = setTimeout(cb.bind(this), 0);
    }
    toExecTask() {
        if (!this.timeId) {
            this.$nextTick(() => {
                this.timeId = 0;
                this.execTask();
            });
        }
    }
}
