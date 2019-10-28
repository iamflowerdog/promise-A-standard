
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function MyPromise (fn) {
    let self = this; 
    self.value = null; 
    self.error = null; 
    self.status = PENDING;
    self.onFulfilledCallbacks = [];
    self.onRejectedCallbacks = [];
    
    function resolve (value) { 
        if (value instanceof MyPromise) {
            return value.then(resolve, reject);
        }
        if (self.status === PENDING) {
            setTimeout(() => {
                self.status = FULFILLED; // 执行成功后保存状态
                self.value = value;
                self.onFulfilledCallbacks.forEach(callback => {
                    callback(self.value);
                });
            }, 0)
        }
    }

    function reject (error) { 
        if (self.status === PENDING) {
            setTimeout(() => {
                self.status = REJECTED; // 执行失败后保存状态
                self.error = error; 
                self.onRejectedCallbacks.forEach(callback => callback(self.error));
            }, 0)
        }
    }
    try {
        fn(resolve, reject); 
    } catch (e) {
        reject(e);
    }
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
    // 第一次调用时候 onFulfilled = f1;
    // p.then(f1) 这个时候的self.value fs.readFile('./file/1.txt', "utf8") 返回的值
    const self = this;
    let bridgePromise;
    // 防止使用者不传成功或者失败的回调函数，给onFulfilled、onRejected默认回调函数
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : error => { throw error };
    if (self.status === FULFILLED) {
        return bridgePromise = new MyPromise((resolve, reject) => {
            setTimeout(() => {
                try {
                    let x = onFulfilled(slef.value); // x是 f1 返回的 promise
                    resolvePromise(bridgePromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            })
        })
    } 
    if (self.status === REJECTED) {
        return bridgePromise = new MyPromise((resolve, reject) => {
            setTimeout(() => {
                try {
                    let x = onRejected(self.error);
                    resolvePromise(bridgePromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            })
        })
    } 
    if (self.status === PENDING) {
        return bridgePromise = new MyPromise((resolve, reject) => {
            self.onFulfilledCallbacks.push((value) => {
                try {
                    // onFulfilled --> f1
                    let x = onFulfilled(value);
                    resolvePromise(bridgePromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
            self.onRejectedCallbacks.push((error) => {
                try {
                    let x = onRejected(error);
                    resolvePromise(bridgePromise, x, resolve, reject)
                } catch (e) {
                    reject(e);
                }
            })
        })
    }
}

function resolvePromise (bridgePromise, x, resolve, reject) {
    // 2.3.1规范，避免循环引用
    if (bridgePromise === x) {
        return reject(new TypeError('Circular reference'));
    }
    let called = false;
    if (x instanceof MyPromise) {
        //
        if (x.status === PENDING) {
            x.then(y => {
                resolvePromise(bridgePromise, y, resolve, reject);
            }, error => {
                reject(error);
            })
        } else {
            x.then(resolve, reject);
        }
        // 2.3.3.1 如果x为对象或者函数
    } else if (x !== null && ((typeof x === 'object' || typeof x === 'function'))) {
        try {
            // 是否是thenable对象（具有then方法的对象/函数）
            let then = x.then;
            if (typeof then === 'function') {
                // 2.3.3.3 如果then是一个函数，以x为this调用then函数，且第一个参数是resolvePromise，第二个是rejectPromise
                then.call(x, y => {
                    if (called) return;
                    called = true;
                    resolvePromise(bridgePromise, y, resolve, reject);
                }, error => {
                    if (called) return;
                    called = true;
                    reject(error);
                })
            } else {
                // 2.3.3.4 如果then不是一个函数，则以x为值fulfill promise
                resolve(x);
            }
        } catch (e) {
            // 2.3.3.2 如果x.then值时抛出异常，则以这个异常作为原因将promise拒绝
            if (called) return;
            called = true;
            reject(e)
        }
    } else {
        resolve(x);
    }
}

// catch方法就是一个语法糖，就是只传reject不传resolve的then方法
MyPromise.prototype.catch = function (reject) {
    return this.then(null, reject);
}

MyPromise.all = function (promises) {
    return new MyPromise(function (resolve, reject) {
        let reslut = [];
        let count = 0;
        for (let i =0; i < promises.length; i++) {
            promises[i].then(function (data) {
                reslut[i] = data;
                if (++count === promises.length) {

                    resolve(result);
                }
            }, function (error) {
                reject(error)
            })
        }
    });
}

MyPromise.race = function (promises) {
    return new MyPromise(function(resolve, reject) {
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(function(data) {
                resolve(data);
            }, function(error) {
                reject(error);
            });
        }
    });
}

// 执行测试用例需要用到的代码
MyPromise.deferred = function () {
    let defer = {};
    defer.promise = new MyPromise((resolve, reject) => {
        defer.resolve = resolve;
        defer.reject = reject;
    });
    return defer;
}

try {
    module.exports = MyPromise;
} catch (e) {}
