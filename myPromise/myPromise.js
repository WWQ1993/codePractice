class MyPromise {
    thenFnList = [];
    finallyFn = () => {};
    catchFn = (e) => {
        throw new Error(e);
    };
    // 立即执行
    static resolve(val) {
        return new MyPromise(res => {
            res(val)
        });
    };
    static reject (err) {
        return new MyPromise((res, rej) => {
            rej(err)
        });
    };

    constructor (fn) {
        // 链式传参完成后才执行
        setTimeout(() => {
            try {
                fn(this.resolve.bind(this), this.reject.bind(this));
            } catch (e) {
                this.catchFn(e);
                this.finallyFn();
            }
        }, 0);
    }
    resolve(arg) {
        try {
            let thenFn = this.thenFnList.shift();
            let result = thenFn(arg);
            // 支持链式调用
            if (result instanceof MyPromise) {
                let p = result;
                this.thenFnList.forEach(fn => {
                    p = p.then(fn);
                });
                p.catch(this.catchFn);
                p.finally(this.finallyFn);
            } else {
                this.finallyFn();
            }
        } catch (e) {
            this.catchFn(e);
            this.finallyFn();
        }
    }
    reject(err) {
        this.catchFn(err);
        this.finallyFn();
    }
    finally(fn) {
        if (fn) {
            this.finallyFn = fn;
        }
    }
    then(fn = () => {}) {
        this.thenFnList.push(fn);
        return this;
    }
    catch(fn) {
        if (fn) {
            this.catchFn = fn;
        }
        return this;
    }
}
