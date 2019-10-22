    function MyPromise (fn) {
        let self = this; // 缓存promise实例的this
        self.value = null; // 给pormise实例注册一个变量，用来缓存成功回调返回的数据
        self.error = null; // 给pormise实例注册一个变量，用来缓存成功回调返回的数据
        self.onFulfilled = null; // 给pormise实例注册一个onFulfilled变量，等待实例调用then()函数之后，传入成功回调函数
        self.onRejected = null; // 给pormise实例注册一个onRejected变量，等待实例调用then()函数之后，传入失败的回调函数

        // 构造函数中声明一个resolve函数
        function reslove (value) { 
            self.value = value; // 成功后缓存返回的值
            self.onFulfilled(value); // 回调成功后调用实例传入成功的函数
        }

        // 构造函数中声明一个reject函数
        function reject (error) { 
            self.error = error; // 失败后缓存失败后返回的值
            self.onRejected(error); // 回调失败后调用实例传入失败的函数
        }

        // 实例化的过程中，new Pormise(function(){})，调用传入的fn函数，并且传入reslove和reject两个函数
        fn(reslove, reject); 
    }

    // 这里给 MyPromise 构造函数的原型上面添加一个then方法 promise实例通过 promise.then((data)=> {}, (err)=> {}) 把成功和失败的方法注册进来
    MyPromise.prototype.then = function (onFulfilled, onRejected) {
        this.onFulfilled = onFulfilled; // 
        this.onRejected = onRejected;
    }

    module.exports = MyPromise
