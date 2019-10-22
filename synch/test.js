let Promise = require('./mypromise');

let mypromise = new Promise((reslove, reject) => {
    reslove('synch task'); 
});

function success (data) {
    console.log(data);
}

function error (err) {
    console.log(err);
}

// mypromise.then(success, error);