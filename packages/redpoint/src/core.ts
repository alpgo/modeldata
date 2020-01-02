import * as route from '@modeldata/route';
import { RedType } from './types';

export interface RedDataType
{
    routeList: route.RouteType<any>[];
    handle: Function;
    views: Function[];
}

export function register(options: RedDataType): RedType
{
    return new Red(options);
}

export class Red implements RedType
{
    constructor(public options: RedDataType) { }

    private hasLoaded: boolean = false;

    private loading: boolean = false;

    addView(fn: Function)
    {
        this.options.views.push(fn);
    }

    removeView(fn: Function)
    {
        const index = this.options.views.indexOf(fn);
        this.options.views.splice(index, 1);
    }

    loadData()
    {
        const promises = this.options.routeList.map(r => r.request());
        Promise.all(promises).then(() =>
        {
            this.hasLoaded = true;
            this.handleData();
            // 注册监听路由数据变化, 数据变化通知小红点处理数据
            this.options.routeList.forEach(currentRoute => currentRoute.updates.push(this.handleData.bind(this)));
        }).catch(function (e)
        {
            console.log(e);
        });
    }

    handleData()
    {
        // 解析数据
        const data = this.options.handle();
        // 更新视图
        this.options.views.forEach(fn => fn(data));
    }

    loadOnce()
    {
        if (this.loading) {
            return;
        }
        this.loadData();
        this.loading = true;
    }

    run()
    {
        if (this.hasLoaded) {
            this.handleData();
        } else {
            this.loadOnce();
        }
    }
}