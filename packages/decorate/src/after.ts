import * as utils from '@modeldata/utils';

const KEY = "__after__";

export function after(fn: Function)
{
    return function (target: any, name: string, desc: PropertyDescriptor)
    {
        const obj = target[KEY] = target[KEY] || {};
        const arr = obj[name] = obj[name] || [];
        arr.push(fn);
    };
}

export function handleAfter(thisArgs: any)
{
    const target = Object.getPrototypeOf(thisArgs);
    const obj = target[KEY] || {};
    utils.forEach(obj, function (arr: any[], name: string)
    {
        const desc = Object.getOwnPropertyDescriptor(target, name);
        const originValue = desc.value;
        desc.value = function ()
        {
            const _this = this;
            const args = Array.prototype.slice.call(arguments);
            const result = originValue.call(this, ...args);
            utils.forEach(arr, function (fn: any)
            {
                fn.call(_this, result);
            });
            return result;
        }
        Object.defineProperty(target, name, desc);
    });
}