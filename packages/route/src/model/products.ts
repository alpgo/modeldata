import * as http from '../http';

export interface ProductItemType
{
    id: number;
    name: string;
    category: string;
    price: number;
}

export type ProductsType = ProductItemType[];

export class Products
{
    data: ProductsType;

    getItemByID(id: number): ProductItemType
    {
        return this.data.filter(function (item)
        {
            return item.id === id;
        })[0];
    }
}

export const products = http.registerRoute<ProductsType>({
    name: "获取产品列表",
    method: "get",
    url: "/products"
});