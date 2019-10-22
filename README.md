## 手写一个符合Promise/A+规范的promise （异步编程）

### basic 目标

* 可以创建promise对象实例
* promise实例通过promise.then()注册传入的异步方法， 当promise reslove时，就invoker注册成功的函数，反之亦然
