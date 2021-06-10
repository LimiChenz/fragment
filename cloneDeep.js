/**
 * 深拷贝
 */

// 可遍历的类型
const mapTag = '[object Map]';
const setTag = '[object Set]';
const arrayTag = '[object Array]';
const objectTag = '[object Object]';
const argsTag = '[object Arguments]';

const deepTag = [mapTag, setTag, argsTag, objectTag, argsTag];

// 不可遍历的类型
const boolTag = '[object Boolean]';
const dateTag = '[object Date]';
const errorTag = '[object Error]';
const numberTag = '[object Number]';
const regexpTag = '[object RegExp]';
const stringTag = '[object String]';
const symbolTag = '[object Symbol]';
const funcTag = '[object Function]';

// 初始化克隆对象
function getInit(target) {
    const Ctor = target.constructor;
    return new Ctor
}

// 克隆symbol
function cloneSymbol(target) {
    return Object(Symbol.prototype.valueOf.call(target));
}

function getType(target) {
    return Object.prototype.toString.call(target);
}

function isPlantObject(obj) {
    return typeof obj === 'object' && Object.prototype.toString.call(obj) === '[object Object]';
}

function isObject(obj) {
    const type = typeof obj
    return type !== null && (type === 'object' || type === 'function');
}

// 克隆正则
function cloneReg(target) {
    const reFlags = /\w*s/;
    const result = new target.constructor(target.source, reFlags.exec(target));
    result.lastIndex = target.lastIndex;
    return result;
}

// 克隆函数
function cloneFunction(func) {
    const bodyReg = /(?<={)(.|\n)+(?=})/mg;
    const paramReg = /(?<=\().+(?=\)\s+{)/g;
    const funcString = func.toString();

    if (func.prototype) {
        const param = paramReg.exec(funcString);
        const body = bodyReg.exec(funcString);
        if (body) {
            if (param) {
                const paramArr = param[0].split(',');
                return new Function(...paramArr, body[0])
            } else {
                return new Function(body[0])
            }
        } else {
            return null
        }

    } else {
        return eval(funcString)
    }
}


// 封装while来遍历对象
function foreach(array, iteratee) {
    let index = -1;
    const length = array.length;

    while (++index < length) {
        iteratee(array[index], index)
    }

    return array
}

// 克隆其他类型
function cloneOtherType(target, type) {
    const Ctor = target.constructor;
    switch (type) {
        case boolTag:
        case numberTag:
        case stringTag:
        case errorTag:
        case dateTag:
            return new Ctor(target);
        case regexpTag:
            return cloneReg(target);
        case symbolTag:
            return cloneSymbol(target);
        case funcTag:
            return cloneFunction(target);
        default:
            return null
    }
}

// 解决循环引用
let map = new WeakMap();
function clone(target) {

    if (!isObject(target)) {
        return target
    }

    const type = getType(target);

    let cloneTarget
    if (deepTag.includes(type)) {
        cloneTarget = getInit(target, type);
    }else{
        return cloneOtherType(target, type);
    }    

    // 解决循环引用
    if (map.get(target)) {
        return target;
    }
    map.set(target, cloneTarget);

    if (type === setTag) {
        target.forEach(value =>{
            cloneTarget.add(clone(value))
        })
        return cloneTarget
    }

    if (type === mapTag) {
        target.forEach((key, value) =>{
            cloneTarget.set(key, clone(value))
        })
        return cloneTarget
    }

    let isArray = Array.isArray(target);
    // while 的性能最好 其次是for 最后for in
    let keys = isArray ? undefined : Object.keys(target)
    foreach(keys || target, (value, key) => {
        if (keys) {
            key = value
        }

        cloneTarget[key] = clone(target[key])
    })

    return cloneTarget

}

let ma = new Map([
    {b: '1'}, {a: '1'}
])
const target = {
    field1: 1,
    field2: ma,
    field3: {
        child: 'child'
    },
    field4: [2, 4, 8]
};
target.target = target;
console.log(clone(target));

