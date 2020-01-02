import * as decorate from '@modeldata/decorate';
import * as route from '@modeldata/route';
import { $$ } from './utils';

export default class ProductLayer
{
    constructor()
    {
        decorate.use(this);
    }

    private context: HTMLElement;
    private table: HTMLElement;
    private container: HTMLElement;

    @decorate.init
    initUI()
    {
        this.context = document.querySelector('#products');
        if (!this.context) {
            throw new Error('init error');
        }
        this.container = $$('.container', this.container)[0];
        this.table = $$('.data-table', this.context)[0];
        this.container.style.display = 'none';
    }

    @decorate.init
    showEnterAnimation()
    {
        console.log('show enter animation');
    }

    @decorate.init
    registerListener()
    {
        const navCartUI = $$('nav .cart-icon', this.context)[0];
        navCartUI.addEventListener('click', () =>
        {
            console.log('goto cart layer');
        }, false);
    }

    @decorate.http(route.products)
    loadData()
    {
        console.log(route.products.data);
        this.renderData(route.products.data);
    }

    /**
     * 渲染表格数据
     * @param data 
     */
    @decorate.after(ProductLayer.prototype.showPopupAnimation)
    renderData(data: route.ProductsType)
    {
        const tbody = $$('tbody', this.table)[0];
        data.forEach(itemdata =>
        {
            var row = this.createRow(itemdata);
            tbody.appendChild(row);
        });
    }

    createRow(data: any)
    {
        var row = document.createElement('tr');
        row.className = "row";
        row.innerHTML = this.getRowHTML(data);
        return row;
    }

    getRowHTML(data: any)
    {
        return `<td>${data.id}</td>
                <td>${data.name}</td>
                <td>${data.category}</td>
                <td>${data.price}</td>
                <td>
                    <a class="cart-icon" href="#">购物车</a>
                </td>`;
    }

    /**
     * 弹出动画
     */
    showPopupAnimation()
    {
        console.log("showPopupAnimation");
        this.container.style.display = 'block';
        this.container.classList.add('popup');
    }
}