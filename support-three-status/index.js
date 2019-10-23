
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function Chain (fn) {
    let self = this; 
    self.value = null; 
    self.error = null; 
    self.status = PENDING;
    self.onFulfilled = null; 
    self.onRejected = null; 

    
    function reslove (value) { 
        if (self.status === PENDING) {
            setTimeout(() => {
                self.status = FULFILLED; // 执行成功后保存状态
                self.value = value;
                self.onFulfilled(value); 
            })
        }
    }

    
    function reject (error) { 
        if (self.status === PENDING) {
            setTimeout(() => {
                self.status = REJECTED; // 执行失败后保存状态
                self.error = error; 
                self.onRejected(error); 
            })
        }
    }
    fn(reslove, reject); 
}

Chain.prototype.then = function (onFulfilled, onRejected) {
    if (this.status === PENDING) {
        this.onFulfilled = onFulfilled; // 
        this.onRejected = onRejected;
    } else if (this.status === FULFILLED) {
        this.onFulfilled(this.value);
    } else {
        this.onRejected(this.error);
    }
    return this;
}

module.exports = Chain
