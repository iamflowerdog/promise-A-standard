let Promise = require('./index');
let fs = require('fs');

let p1 = new Promise((resolve, reject) => {
    fs.readFile('./file/1.txt', 'utf-8', function (err, data) {
        err ? reject(err) : resolve(data);
    });
})

let p2 = new Promise((resolve, reject) => {
    fs.readFile('./file/2.txt', 'utf-8', function (err, data) {
        err ? reject(err) : resolve(data);
    });
})

Promise.all([p1, p2]).then( (reslut) => {
    console.log(reslut)
}, function (error) {
    console.log(error);
});

Promise.race([p1, p2]).then(function(result) {
    console.log(result);
}, function(error) {
    console.log(error)
});

// 执行同步任务
Promise.resolve(123).then((res) => {
    console.log(res);
});

Promise.reject(456).then(null, (error) => {
    console.log(error)
})