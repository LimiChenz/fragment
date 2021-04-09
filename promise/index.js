

let p = new Promise((resolve,reject) =>{
    // throw 'ERROR'
    console.log(3);
    resolve(456789)
}).then( res =>{
    return res
}, err => {
    return err
})