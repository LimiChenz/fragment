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


class Promise {
    constructor(exector) {
        this.state = Promise.PENDING
        this.value = null
        this.reason = null
        this.onFulfilledCallbacks = []
        this.onRejectedCallbacks = []

        this.initBind()
        this.init(exector)
    }

    initBind() {
        this.reslove = this.reslove.bind(this)
        this.reject = this.reject.bind(this)
    }

    init(exector) {
        if (typeof exector !== 'function') {
            throw "the parameter must be function"
        }

        try {
            exector(this.reslove, this.reject)
        } catch (error) {
            this.reject(error)
        }
    }

    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === "function" ? onFulfilled : value => value
        onRejected = typeof onRejected === "function" ? onRejected : reason => { throw reason }

        let promise2 = new Promise((resolve, reject) => {
            if (this.state === Promise.PENDING) {
                this.onFulfilledCallbacks.push(value => {
                    try {
                        const x = onFulfilled(value)
                        resolve(x)
                    } catch (error) {
                        reject(error)
                    }
                })
                this.onRejectedCallbacks.push(reason => {
                    try {
                        const x = onRejected(reason)
                        resolve(x)
                    } catch (error) {
                        reject(error)
                    }
                })
            }

            if (this.state === Promise.FULFILLED) {
                const fn = () => {
                    try {
                        const x = onFulfilled(this.value)
                        resolve(x)
                    } catch (error) {
                        reject(error)
                    }
                }
                setTimeout(fn, 0)
            }

            if (this.state === Promise.REJECTED) {
                const fn = () => {
                    try {
                        const x = onRejected(this.reason)
                        resolve(x)
                    } catch (error) {
                        reject(error)
                    }
                }
                setTimeout(fn, 0)
            }
        })

        return promise2
    }

    catch(onRejected) {
        this.then(null, onRejected)
    }

    reslove(newValue) {
        // console.log('newValue', newValue);
        if (this.state === Promise.PENDING) {
            setTimeout(() => {
                this.state = Promise.FULFILLED
                this.value = newValue
                this.onFulfilledCallbacks.forEach(cb => cb(this.value))
            }, 0);
        }
    }

    reject(reason) {
        if (this.state === Promise.PENDING) {
            setTimeout(() => {
                this.reason = reason
                this.state = Promise.REJECTED
                this.onRejectedCallbacks.forEach(cb => cb(this.reason))
            }, 0);

        }
    }


}
Promise.reslove = (value) => {
    return new Promise((resolve, reject) => {
        resolve(value)
    })
}

Promise.PENDING = 'pending'
Promise.FULFILLED = 'Fulfilled'
Promise.REJECTED = 'Rejected'

module.exports = Promise