let Promise = require("./mypromise")
let fs = require("fs")

let myPromise = new Promise((resolve, reject) => {
    console.log(resolve, reject);
    fs.readFile('./file/1.txt', "utf8", function(err, data) {
        err ? reject(err) : resolve(data)
    });
});


function successLog(data) {
    console.log(data);
    console.log(myPromise.onFulfilled);
}

function errorLog(error) {
    console.log(error)
}
myPromise.then(successLog, errorLog); 


