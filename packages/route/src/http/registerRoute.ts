import { ConfigType, RouteType } from './types';
import { getRouteID, saveRoute } from './container';
import { ajax, AjaxResponseType, AjaxError, AjaxConfigType } from '../ajax';

type HandlerType = (currentRoute: RouteType<any>, data: any) => any;

let onSuccess = function (currentRoute: RouteType<any>, data: any)
{
    return data;
};

let onFail = function (currentRoute: RouteType<any>, err: any)
{
    return err;
};

const configHttp = {
    baseURL: ""
};

/**
 * 初始化
 */
export function httpInit(baseURL: string)
{
    configHttp.baseURL = baseURL;
}

/**
 * 注册数据预先处理函数
 */
export function registerHttp(success: HandlerType, fail: HandlerType)
{
    onSuccess = success;
    onFail = fail;
}

/**
 * 注册路由
 * @param config 
 */
export function registerRoute<T>(config: ConfigType): RouteType<T>
{
    const routeID = getRouteID();
    const currentRoute = {
        routeID,
        config,
        data: {} as T,
        request: function ()
        {
            return sendRequest(currentRoute);
        },
        updates: [] as Function[]
    };
    saveRoute(routeID, currentRoute);
    return currentRoute;
}

/**
 * 路由AJAX请求封装
 * @param routeID 路由ID
 * @param config 路由配置
 */
function sendRequest(currentRoute: RouteType<any>): Promise<any>
{
    const options = transferToAjaxConfig(currentRoute.config);
    const request = ajax(options);

    request.then(function (resp: AjaxResponseType)
    {
        const oldData = currentRoute.data;
        const data = onSuccess(currentRoute, resp)
        // 数据更新了, 通知所有监听函数
        updates(currentRoute, oldData);
        return data;
    }).catch(function (error: AjaxError)
    {
        const err = onFail(currentRoute, error);
        throw err;
    });
    return request;
}

/**
 * 将路由参数处理为ajax请求的参数
 * @param config 
 */
function transferToAjaxConfig(config: ConfigType): AjaxConfigType
{
    const options = {
        baseURL: configHttp.baseURL,
        url: config.url,
        method: config.method,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        responseType: 'json'
    };
    return options;
}

/**
 * 数据加载完毕后, 若数据发生变化, 自动通知所有和该数据有关联的监听函数
 */
function updates(currentRoute: RouteType<any>, oldData: any)
{
    const newData = currentRoute.data;
    currentRoute.updates.forEach(fn => fn());
}