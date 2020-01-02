import { handleInit } from './init';
import { handleHttp } from './http';
import { handleAfter } from './after';
import { handleRedpoint } from './redpoint';

export function use<T>(thisArgs: T)
{
    handleInit(thisArgs);
    handleHttp(thisArgs);
    handleAfter(thisArgs);
    handleRedpoint(thisArgs);
}