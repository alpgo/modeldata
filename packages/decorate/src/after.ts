import * as utils from '@modeldata/utils';

const KEY = "__after__";

export function after(proto: any, fname: string)
{
    if (!proto[fname]) {
        console.warn(`找不到fname = ${fname}`);
        return null;
    }
    return function (target: any, name: string, desc: PropertyDescriptor)
    {
        const obj = target[KEY] = target[KEY] || {};
        const arr = obj[name] = obj[name] || [];
        arr.push({
            proto,
            fname
        });
    };
}

const list: any[] = [];

export function handleAfter(thisArgs: any)
{
    const target = Object.getPrototypeOf(thisArgs);
    if (list.indexOf(target) == -1) {
        updateDescriptor(target);
        list.push(target);
    } else { }
}

function updateDescriptor(target: any)
{
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
            utils.forEach(arr, function (item: { proto: any, fname: string })
            {
                // 因为proto[fname]对象的原始方法, 在代码装饰器处理过程中可能被修改了, 所以需要动态获取该函数
                const fn = Object.getOwnPropertyDescriptor(item.proto, item.fname).value;
                fn.call(_this, result);
            });
            return result;
        }
        Object.defineProperty(target, name, desc);
    });
}