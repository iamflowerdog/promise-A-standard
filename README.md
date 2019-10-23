## 手写一个符合Promise/A+规范的promise （异步编程）

### basic/ 完成基本异步编程方案

* 可以创建promise对象实例
* promise实例通过promise.then()注册传入的异步方法， 当promise reslove时，就invoker注册成功的函数，反之亦然

### synch/  支持同步任务

* 如果是同步任务，会先去调用构造函数里面的 onFulfilled 方法 会报错 self.onFulfilled is not a function
* 利用定时器异步执行这个思路，等待then方法执行后，再执行里面的代码

### support-three-status/ 支持三种状态 

* 实现promise对象的状态改变，改变只有两种可能：从pending到fulfilled，和从pending到rejected
* 实现一旦promise状态改变，再对promise对象添加回调函数，也会立刻得到这个结果
* 在Promise构造函数里面，执行成功或者失败，保存status

### chain/ 支持链式调用 / 执行结果为并行异步任务

* 因为链式调用是同步的，所以 `promise.then(f1).then(f2)...` 会先把f1、f2函数注册进promise对象实例的onFulfilledCallbacks属性中
* 等回调成功后(status状态凝固，变成fulfilled) 通过forEach() 遍历回调数组执行回调函数
`self.onFulfilledCallbacks.forEach((callback) => callback(self.value));`
* 这里注意 回调成功后， f()、f2()、调用是同步执行的，但是如果f2需要用到f1()通过ajax异步获取数据的值该怎么办呢？这就需要下一节的串行异步任务

### serial-async


