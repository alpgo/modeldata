import { registerHttp, RouteType, AjaxResponseType, httpInit } from '@modeldata/route';

registerHttp(function (currentRoute: RouteType<any>, respData: AjaxResponseType)
{
    currentRoute.data = respData.data;
    return currentRoute.data;
}, function (currentRoute, err)
{
    //TODO: show error ui
    console.log(`currentRoute.url="${currentRoute.config.url}" occured error ${err}`);
});

httpInit("http://localhost:3500");