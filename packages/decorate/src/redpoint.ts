import * as  Rpoint from '@modeldata/redpoint';

const KEY = "__redpoint__";

export function redpoint(data: Rpoint.RedType)
{
    return function (target: any, name: string, desc: PropertyDescriptor) 
    {
        const arr = target[KEY] = target[KEY] || [];
        arr.push({
            name,
            data
        });
    };
}

export function handleRedpoint(thisCtx: any)
{
    let proto = Object.getPrototypeOf(thisCtx);
    var arr: any[] = proto[KEY] || [];
    arr.forEach(function (item)
    {
        const data = item.data as Rpoint.RedType;
        data.addView(proto[item.name].bind(thisCtx));
        //TODO: removeView
        data.run();
    });
}