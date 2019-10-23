let Promise = require('./index');
let fs = require('fs');

let p = new Promise((resolve, reject) => {
    fs.readFile('./file/3.txt', "utf8", function(err, data) {
        err ? reject(err) : resolve(data)
    });
});
let f1 = function(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
        fs.readFile('./file/2.txt', "utf8", function(err, data) {
            err ? reject(err) : resolve(data)
        });
    });
}
let f2 = function(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
        fs.readFile('./file/3.txt', "utf8", function(err, data) {
            err ? reject(err) : resolve(data)
        });
    });
}
let f3 = function(data) {
    console.log(data);
}
let errorLog = function(error) {
    console.log(error)
}
p.then(f1).then(f2).then(f3)
