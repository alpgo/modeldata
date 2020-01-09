import * as decorate from '@modeldata/decorate';

const Sprite = Laya.Sprite;
function newSprite(...args: any[])
{
    // @ts-ignore
    Sprite.call(this, ...args);
    decorate.use(this);
}
newSprite.prototype = Sprite.prototype;
// @ts-ignore
Laya.Sprite = newSprite;

// copy static method
Object.keys(Sprite).map(key => Laya.Sprite[key] = Sprite[key]);