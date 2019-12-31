/**
* Iterate over an Array or an Object invoking a function for each item.
* @param  obj The object or array to iterate
* @param  fn The callback to invoke for each item
*/
export default function forEach(obj: Object | Array<any>, fn: Function)
{
    // Don't bother if no value provided
    if (obj === null || typeof obj === 'undefined') {
        return;
    }

    // Force an array if not already something iterable
    if (typeof obj !== 'object') {
        obj = [obj];
    }

    if (Array.isArray(obj)) {
        iterArray(obj, fn);
    } else {
        iterObject(obj, fn);
    }
}

/**
* Iterate over an Array invoking a function for each item.
* @param  arr The array to iterate
* @param  fn The callback to invoke for each item
 */
function iterArray(arr: any[], fn: Function)
{
    for (var i = 0, l = arr.length; i < l; i++) {
        fn.call(null, arr[i], i, arr);
    }
}

/**
* Iterate over an Object invoking a function for each item.
* @param  obj The object to iterate
* @param  fn The callback to invoke for each item
 */
function iterObject(obj: { [key: string]: any }, fn: Function)
{
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn.call(null, obj[key], key, obj);
        }
    }
}