function logVal(val, res = () => {}, delay = 500) {
    return setTimeout(() => {
        let div = document.createElement('div');
        div.innerText = val;
        document.body.appendChild(div);
        res(val);
    }, delay);
}

new MyPromise((res, rej) => {
    logVal(1, res);
}).then(() => {
    return new MyPromise((res, rej) => {
        logVal(2, res);
    });
}).then(() => {
    logVal(3);
    let MyPromise1 = MyPromise.resolve(123);
    MyPromise1.then(function(value) {
        logVal(value);
    });
    console.log(eee);
}).catch(e => {
    logVal(e);
}).finally(() => {
    logVal('finally');
});




