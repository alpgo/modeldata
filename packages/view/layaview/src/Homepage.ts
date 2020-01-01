import * as decorate from '@modeldata/decorate';
import * as route from '@modeldata/route';

export class Homepage extends Laya.Sprite
{
    constructor()
    {
        super();
        decorate.use(this);
    }

    @decorate.init
    loadRes()
    {
        const skins = './images/button-1.png';
        Laya.loader.load(skins, Laya.Handler.create(this, this.onUIAssetsLoaded));
    }

    onUIAssetsLoaded()
    {
        var btn = new Laya.Button('./images/button-1.png');
        Laya.stage.addChild(btn);
        return btn;
    }

    @decorate.http(route.products)
    loadData()
    {
        console.log(route.products.data[0]);
    }
}