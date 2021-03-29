

let p = new Promise((resolve,reject) =>{
    // throw 'ERROR'
    console.log(3);
    reject(456789)
}).catch(err=>{
    console.log(err);
})