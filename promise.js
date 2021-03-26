/**
 * Pending 等待状态
 * Fulfilled 执行状态
 * Rejected 拒绝状态
 * 
 * 1.可进行链式调用，且每次 then 返回了新的 Promise(2次打印结果不一致，
 *   如果是同一个实例，打印结果应该一致
 * 2.只输出第一次 resolve 的内容，reject 的内容没有输出，即 Promise 是有状态且状态
 *   只可以由pending -> fulfilled或 pending-> rejected,是不可逆的
 * 3.then 中返回了新的 Promise,但是then中注册的回调仍然是属于上一个 Promise 的
 */

function Promise(fn) {
    var state = 'pending',
        value = null,
        callbacks = [];

    this.then = function (onFulfilled) {
        if (state === 'pending') {
            callbacks.push(onFulfilled)
            console.log(callbacks);
            return this
        }
        console.log(1, onFulfilled);
        onFulfilled(value)
        return this
    }

    function reslove(newValue) {
        value = newValue
        state = 'fulfilled'
        const f = () => {
            callbacks.forEach((callback) => {
                callback(value)
            })
        }
        setTimeout(f, 0)
    }

    fn(reslove)
}