import './layapolyfill';
import * as decorate from '@modeldata/decorate';
import * as route from '@modeldata/route';
import { Homepage } from './Homepage';

export class Main
{
    constructor()
    {
        decorate.use(this);
    }

    @decorate.init
    initStage()
    {
        Laya.init(Laya.Browser.clientWidth, Laya.Browser.clientHeight, Laya.WebGL);
        Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
        Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;

        Laya.stage.scaleMode = "showall";
        Laya.stage.bgColor = "#232628";
    }

    @decorate.init
    initHttp()
    {
        route.httpInit("http://localhost:3500");
        this.registerHttpMiddleware();
    }

    registerHttpMiddleware()
    {
        route.registerHttp(function (currentRoute: route.RouteType<any>, respData: route.AjaxResponseType)
        {
            currentRoute.data = respData.data;
            return currentRoute.data;
        }, function (currentRoute, err)
        {
            //TODO: show error ui
            console.log(`currentRoute.url="${currentRoute.config.url}" occured error ${err}`);
        });
    }

    @decorate.init
    createView()
    {
        Laya.stage.addChild(new Homepage());
    }
}