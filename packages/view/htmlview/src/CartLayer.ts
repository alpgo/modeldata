import * as decorate from '@modeldata/decorate';
import * as route from '@modeldata/route';

export default class CartLayer
{
    constructor()
    {
        decorate.use(this);
    }

    @decorate.http(route.carts)
    loadData()
    {
        console.log(route.carts.data);
    }
}