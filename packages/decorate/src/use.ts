import { handleInit } from './init';
import { handleHttp } from './http';
import { handleAfter } from './after';

export function use<T>(thisArgs: T)
{
    handleInit(thisArgs);
    handleHttp(thisArgs);
    handleAfter(thisArgs);
}