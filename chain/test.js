let Chain = require('./index');
let fs = require('fs');

let promise = new Chain((reslove, reject) => {
    fs.readFile('./file/1.txt', "utf-8", function (err, data) {
        err ? reject(err) : reslove(data);
    })
})

let f1 = function (data) {
    // console.log(promise); // {value: "hello promise", error: null, status: "fulfilled", onFulfilledCallbacks: Array(3), onRejectedCallbacks: Array(3)}
    console.log("f1", data);
}

let f2 = function (data) {
    console.log(promise);
    console.log("f2", data);
}

let f3 = function (data) {
    console.log("f3", data);
}

promise.then(f1).then(f2).then(f3);
// console.log(promise); // {value: null, error: null, status: "pending", onFulfilledCallbacks: Array(3), onRejectedCallbacks: Array(3)}
