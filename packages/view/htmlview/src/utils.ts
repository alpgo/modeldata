/**
 * HTML选择器
 * @param selector 
 * @param context 
 */
export function $$(selector: string, context?: Document | HTMLElement): HTMLElement[]
{
    context = context || document;
    var elements = context.querySelectorAll(selector);
    return Array.prototype.slice.call(elements);
}
