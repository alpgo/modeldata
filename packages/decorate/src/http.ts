import { RouteType } from '@modeldata/route';

const KEY = "__http__";

interface Data
{
    name: string;
    route: RouteType<any>;
}

export function http(route: RouteType<any>)
{
    return function (target: any, name: string, desc: PropertyDescriptor)
    {
        const arr = target[KEY] = target[KEY] || [];
        arr.push({
            name,
            route
        });
    };
}

export function handleHttp(thisArgs: any)
{
    let proto = Object.getPrototypeOf(thisArgs);
    var arr: Data[] = proto[KEY] || [];
    arr.forEach(data =>
    {
        data.route.request().then(function (respData: any)
        {
            var method = proto[data.name];
            method.call(thisArgs, respData);
        });
    });
}