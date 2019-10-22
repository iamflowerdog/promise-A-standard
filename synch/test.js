let Promise = require('./mypromise');
let fs = require('fs');

let mypromise = new Promise((resolve, reject) => {
    fs.readFile('./file/1.txt', "utf8", function(err, data) {
        err ? reject(err) : resolve(data)
    });
});

function success (data) {
    console.log('f1', data);
}

function error (err) {
    console.log(err);
}

function f2 (data) {
    console.log('f2', data)
}
mypromise.then(success, error);

setTimeout(() => {
    mypromise.then(f2, error);
}, 2000)

