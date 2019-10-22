function MyPromise (fn) {
    let self = this; 
    self.value = null; 
    self.error = null; 
    self.onFulfilled = null; 
    self.onRejected = null; 

    
    function reslove (value) { 
        // 如果没有setTimeout，在执行同步任务的时候会报错，因为then还没执行，函数还没注册进来
        setTimeout(() => {
            self.value = value; 
            self.onFulfilled(value); 
        })
    }

    
    function reject (error) { 
        // 如果没有setTimeout，在执行同步任务的时候会报错，因为then还没执行，函数还没注册进来
        setTimeout(() => {
            self.error = error; 
            self.onRejected(error); 
        })
    }

    
    fn(reslove, reject); 
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
    this.onFulfilled = onFulfilled; // 
    this.onRejected = onRejected;
}

module.exports = MyPromise
