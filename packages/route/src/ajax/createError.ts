import { AjaxErrorResponseType, AjaxError } from './types';

/**
 * Update an Error with the specified config, error code, and response.
 * 
 * @param options - 错误上下文信息
 * @returns The error.
 */
export function createError(options: AjaxErrorResponseType): AjaxError
{
    var error = new Error(options.message) as any;
    error.config = options.config;
    if (options.code) {
        error.code = options.code;
    }
    error.request = options.request;
    error.response = options.response;
    error.toJSON = function ()
    {
        return {
            message: this.message,
            config: this.config,
            code: this.code
        };
    };
    return error;
}