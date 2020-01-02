import { register } from './core';
import { products, carts } from '@modeldata/route';

export const cartsRed = register({
    views: [],
    routeList: [products, carts],
    handle: function ()
    {
        if (carts.data.length > 0) {
            return true;
        } else {
            return false;
        }
    }
});