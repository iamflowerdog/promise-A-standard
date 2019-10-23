
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
    

    
    function reslove (value) { 
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
                self.onRejectedCallbacks.forEach(callback => callback(self.value));
            }, 0)
        }
    }
    fn(reslove, reject); 
}

SerialAsych.prototype.then = function (onFulfilled, onRejected) {
    if (this.status === PENDING) {
        console.log('register');
        this.onFulfilledCallbacks.push(onFulfilled);
        this.onRejectedCallbacks.push(onRejected);
    } else if (this.status === FULFILLED) {
        this.onFulfilled(this.value);
    } else {
        this.onRejected(this.error);
    }
    return this; // 为了支持链式调用，每次then()调用都会返回this
}

module.exports = SerialAsych
