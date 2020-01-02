import * as http from '../http';

export interface CartItemType
{
    id: number;
    count: number;
}

export type CartsType = CartItemType[];

export class Carts
{
    data: CartsType;
}

export const carts = http.registerRoute<CartsType>({
    name: "获取购物车",
    method: "get",
    url: "/carts"
});