import * as url from './url';
import * as utils from "@modeldata/utils";
import { AjaxConfigType, AjaxResponseType } from './types';
import { createError } from './createError';

/**
 * AJAX接口的底层实现方法
 * 
 * @param config - 路由配置信息
 * @return Promise异步
 */
export default function ajax(config: AjaxConfigType): Promise<any>
{
    return new Promise(function (resolve, reject)
    {
        var requestData = config.data;
        var requestHeaders = config.headers;

        var request = new XMLHttpRequest();

        var fullPath = url.buildFullPath(config.baseURL, config.url);
        request.open(config.method.toUpperCase(), url.buildURL(fullPath, config.params), true);

        // Set the request timeout in MS
        request.timeout = config.timeout;

        // Listen for ready state
        request.onreadystatechange = function handleLoad()
        {
            if (!request || request.readyState !== 4) {
                return;
            }

            // Prepare the response
            var responseHeaders = url.parseHeaders(request.getAllResponseHeaders());
            var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
            var response: AjaxResponseType = {
                data: responseData,
                status: request.status,
                statusText: request.statusText,
                headers: responseHeaders,
                config: config,
                request: request
            };

            if (200 === response.status) {
                resolve(response);
            } else {
                reject(createError({
                    message: 'Request failed with status code ' + response.status,
                    config: response.config,
                    request: response.request,
                    response
                }));
            };

            // Clean up request
            request = null;
        }

        // Handle browser request cancellation (as opposed to a manual cancellation)
        request.onabort = function handleAbort()
        {
            if (!request) {
                return;
            }

            reject(createError({
                message: 'Request aborted',
                config,
                code: 'ECONNABORTED',
                request
            }));

            // Clean up request
            request = null;
        };

        // Handle low level network errors
        request.onerror = function handleError()
        {
            // Real errors are hidden from us by the browser
            // onerror should only fire if it's a network error
            reject(createError({
                message: 'Network Error',
                config,
                request
            }));

            // Clean up request
            request = null;
        };

        // Handle timeout
        request.ontimeout = function handleTimeout()
        {
            var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
            reject(createError({
                message: timeoutErrorMessage,
                config,
                code: 'ECONNABORTED',
                request
            }));

            // Clean up request
            request = null;
        };

        // Add headers to the request
        if ('setRequestHeader' in request) {
            utils.forEach(requestHeaders, function setRequestHeader(val: string, key: string)
            {
                if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
                    // Remove Content-Type if data is undefined
                    delete requestHeaders[key];
                } else {
                    // Otherwise add header to the request
                    request.setRequestHeader(key, val);
                }
            });
        }

        // Add withCredentials to request if needed
        if (config.withCredentials) {
            request.withCredentials = !!config.withCredentials;
        }

        // Add responseType to request if needed
        if (config.responseType) {
            request.responseType = config.responseType;
        }

        if (requestData === undefined) {
            requestData = null;
        }

        // Send the request
        request.send(requestData);
    });
}
