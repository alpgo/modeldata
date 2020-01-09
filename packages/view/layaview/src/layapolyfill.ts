import * as decorate from '@modeldata/decorate';

const Sprite = Laya.Sprite;
function newSprite(...args: any[]) {
    // @ts-ignore
    Sprite.call(this, ...args);
    // @ts-ignore
    decorate.use(this);
}
newSprite.prototype = Laya.Sprite.prototype;
// @ts-ignore
Laya.Sprite = newSprite;