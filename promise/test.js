const Promise = require('./promise')

let p = new Promise((resolve,reject)=>{
    reject({ERR: 'ERROR'})
}).catch(err => {
    console.log(err);
})


