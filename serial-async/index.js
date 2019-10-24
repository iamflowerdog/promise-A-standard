
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function SerialAsych (fn) {
    let self = this; 
    self.value = null; 
    self.error = null; 
    self.status = PENDING;
    self.onFulfilledCallbacks = [];
    self.onRejectedCallbacks = [];
    
    function resolve (value) { 
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
    fn(resolve, reject); 
}

SerialAsych.prototype.then = function (onFulfilled, onRejected) {
    // 第一次调用时候 onFulfilled = f1;
    // p.then(f1) 这个时候的self.value fs.readFile('./file/1.txt', "utf8") 返回的值
    const self = this;
    let bridgePromise;
    console.log(bridgePromise);
    // 防止使用者不传成功或者失败的回调函数，给onFulfilled、onRejected默认回调函数
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : error => { throw error };
    if (self.status === FULFILLED) {
        return bridgePromise = new SerialAsych((resolve, reject) => {
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
        return bridgePromise = new SerialAsych((resolve, reject) => {
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
        return bridgePromise = new SerialAsych((resolve, reject) => {
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

// catch方法就是一个语法糖，就是只传reject不传resolve的then方法
SerialAsych.prototype.catch = function (reject) {
    return this.then(null, reject);
}

function resolvePromise (bridgePromise, x, resolve, reject) {
    // 
    if (x instanceof SerialAsych) {
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
    } else {
        resolve(x);
    }
}

module.exports = SerialAsych
