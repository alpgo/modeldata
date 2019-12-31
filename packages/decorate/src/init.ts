const KEY = "__init__";

export function init(target: any, name: string, desc: PropertyDescriptor)
{
    target[KEY] = target[KEY] || [];
    const arr = target[KEY];
    arr.push(name);
}

export function handleInit(thisCtx: any)
{
    let proto = Object.getPrototypeOf(thisCtx);
    var inits: string[] = proto[KEY] || [];
    inits.forEach(name =>
    {
        var method = proto[name];
        method.call(thisCtx);
    });
}