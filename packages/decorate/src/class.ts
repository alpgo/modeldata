import { use } from './use';

export function _class(target)
{
    function func(...args)
    {
        target.call(this, ...args);
        use(this);
    }

    func.prototype = target.prototype;

    Object.keys(target).map(k => func[k] = target[k]);

    return func;
}