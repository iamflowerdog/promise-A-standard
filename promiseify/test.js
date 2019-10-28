let Promise = require('./index');
let fs = require('fs');

let readFile = Promise.promiseify(fs.readFile);

readFile('./file/1.txt', 'utf-8').then(data => {
    console.log(data);
}).catch(err => {
    console.log(err);
})