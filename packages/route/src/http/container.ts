import { RouteType } from './types';

/**
 * 路由缓存<id, route>
 */
const cache: { [key: number]: RouteType<any> } = {};

/**
 * 路由ID
 */
let routeID = 0;

/**
 * 保存路由与路由ID
 * @param routeID 
 * @param route 
 */
export function saveRoute(routeID: number, route: RouteType<any>): boolean
{
    cache[routeID] = route;
    return true;
}

/**
 * 查找路由
 * @param rID 
 */
export function findRouteByID(routeID: number): RouteType<any>
{
    const route = cache[routeID];
    if (!route) {
        console.warn(`没有找到ID: ${routeID}对应的路由, 请检查程序`);
        return null;
    }
    return route;
}

/**
 * 路由ID分配函数
 */
export function getRouteID(): number
{
    routeID++;
    return routeID;
}
