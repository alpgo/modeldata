/*!
 * @modeldata/html - v1.0.0
 * Compiled Wed, 01 Jan 2020 12:52:20 UTC
 *
 * @modeldata/html is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
(function () {
    'use strict';

    /**
    * Iterate over an Array or an Object invoking a function for each item.
    * @param  obj The object or array to iterate
    * @param  fn The callback to invoke for each item
    */
    function forEach(obj, fn) {
        // Don't bother if no value provided
        if (obj === null || typeof obj === 'undefined') {
            return;
        }
        // Force an array if not already something iterable
        if (typeof obj !== 'object') {
            obj = [obj];
        }
        if (Array.isArray(obj)) {
            iterArray(obj, fn);
        }
        else {
            iterObject(obj, fn);
        }
    }
    /**
    * Iterate over an Array invoking a function for each item.
    * @param  arr The array to iterate
    * @param  fn The callback to invoke for each item
     */
    function iterArray(arr, fn) {
        for (var i = 0, l = arr.length; i < l; i++) {
            fn.call(null, arr[i], i, arr);
        }
    }
    /**
    * Iterate over an Object invoking a function for each item.
    * @param  obj The object to iterate
    * @param  fn The callback to invoke for each item
     */
    function iterObject(obj, fn) {
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                fn.call(null, obj[key], key, obj);
            }
        }
    }

    /**
     * Trim excess whitespace off the beginning and end of a string
     * @param str The String to trim
     * @returns The String freed of excess whitespace
     */
    function trim(str) {
        return str.replace(/^\s*/, '').replace(/\s*$/, '');
    }
    /**
     * Build a URL by appending params to the end
     * @param url - The base of the url (e.g., http://www.google.com)
     * @param params - The params to be appended
     * @returns The formatted url
     */
    function buildURL(url, params) {
        if (!params) {
            return url;
        }
        var parts = [];
        forEach(params, function (val, key) {
            parts.push(key + '=' + val);
        });
        var serializedParams = parts.join('&');
        if (serializedParams) {
            url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
        }
        return url;
    }
    /**
     * Determines whether the specified URL is absolute
     * @param url The URL to test
     * @returns True if the specified URL is absolute, otherwise false
     */
    function isAbsoluteURL(url) {
        // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
        // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
        // by any combination of letters, digits, plus, period, or hyphen.
        return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
    }
    /**
     * Creates a new URL by combining the baseURL with the requestedURL,
     * only when the requestedURL is not already an absolute URL.
     * If the requestURL is absolute, this function returns the requestedURL untouched.
     * @param baseURL The base URL
     * @param requestedURL Absolute or relative URL to combine
     * @returns The combined full path
     */
    function buildFullPath(baseURL, requestedURL) {
        if (baseURL && !isAbsoluteURL(requestedURL)) {
            return combineURLs(baseURL, requestedURL);
        }
        return requestedURL;
    }
    /**
     * Creates a new URL by combining the specified URLs
     * @param baseURL The base URL
     * @param relativeURL The relative URL
     * @returns The combined URL
     */
    function combineURLs(baseURL, relativeURL) {
        return relativeURL
            ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
            : baseURL;
    }
    /**
     * Parse headers into an object
     *
     * ```
     * Date: Wed, 27 Aug 2014 08:58:49 GMT
     * Content-Type: application/json
     * Connection: keep-alive
     * Transfer-Encoding: chunked
     * ```
     * @param headers Headers needing to be parsed
     * @returns Headers parsed into an object
     */
    function parseHeaders(headers) {
        var parsed = {};
        var key;
        var val;
        var i;
        if (!headers) {
            return parsed;
        }
        forEach(headers.split('\n'), function parser(line) {
            i = line.indexOf(':');
            key = trim(line.substr(0, i)).toLowerCase();
            val = trim(line.substr(i + 1));
            if (key) {
                parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
            }
        });
        return parsed;
    }

    /**
     * Update an Error with the specified config, error code, and response.
     *
     * @param options - 错误上下文信息
     * @returns The error.
     */
    function createError(options) {
        var error = new Error(options.message);
        error.config = options.config;
        if (options.code) {
            error.code = options.code;
        }
        error.request = options.request;
        error.response = options.response;
        error.toJSON = function () {
            return {
                message: this.message,
                config: this.config,
                code: this.code
            };
        };
        return error;
    }

    /**
     * AJAX接口的底层实现方法
     *
     * @param config - 路由配置信息
     * @return Promise异步
     */
    function ajax(config) {
        return new Promise(function (resolve, reject) {
            var requestData = config.data;
            var requestHeaders = config.headers;
            var request = new XMLHttpRequest();
            var fullPath = buildFullPath(config.baseURL, config.url);
            request.open(config.method.toUpperCase(), buildURL(fullPath, config.params), true);
            // Set the request timeout in MS
            request.timeout = config.timeout;
            // Listen for ready state
            request.onreadystatechange = function handleLoad() {
                if (!request || request.readyState !== 4) {
                    return;
                }
                // Prepare the response
                var responseHeaders = parseHeaders(request.getAllResponseHeaders());
                var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
                var response = {
                    data: responseData,
                    status: request.status,
                    statusText: request.statusText,
                    headers: responseHeaders,
                    config: config,
                    request: request
                };
                if (200 === response.status) {
                    resolve(response);
                }
                else {
                    reject(createError({
                        message: 'Request failed with status code ' + response.status,
                        config: response.config,
                        request: response.request,
                        response: response
                    }));
                }
                // Clean up request
                request = null;
            };
            // Handle browser request cancellation (as opposed to a manual cancellation)
            request.onabort = function handleAbort() {
                if (!request) {
                    return;
                }
                reject(createError({
                    message: 'Request aborted',
                    config: config,
                    code: 'ECONNABORTED',
                    request: request
                }));
                // Clean up request
                request = null;
            };
            // Handle low level network errors
            request.onerror = function handleError() {
                // Real errors are hidden from us by the browser
                // onerror should only fire if it's a network error
                reject(createError({
                    message: 'Network Error',
                    config: config,
                    request: request
                }));
                // Clean up request
                request = null;
            };
            // Handle timeout
            request.ontimeout = function handleTimeout() {
                var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
                reject(createError({
                    message: timeoutErrorMessage,
                    config: config,
                    code: 'ECONNABORTED',
                    request: request
                }));
                // Clean up request
                request = null;
            };
            // Add headers to the request
            if ('setRequestHeader' in request) {
                forEach(requestHeaders, function setRequestHeader(val, key) {
                    if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
                        // Remove Content-Type if data is undefined
                        delete requestHeaders[key];
                    }
                    else {
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

    /**
     * 路由缓存<id, route>
     */
    /**
     * 路由ID
     */
    var routeID = 0;
    /**
     * 路由ID分配函数
     */
    function getRouteID() {
        routeID++;
        return routeID;
    }

    var onSuccess = function (currentRoute, data) {
        return data;
    };
    var onFail = function (currentRoute, err) {
        return err;
    };
    var configHttp = {
        baseURL: ""
    };
    /**
     * 初始化
     */
    function httpInit(baseURL) {
        configHttp.baseURL = baseURL;
    }
    /**
     * 注册数据预先处理函数
     */
    function registerHttp(success, fail) {
        onSuccess = success;
        onFail = fail;
    }
    /**
     * 注册路由
     * @param config
     */
    function registerRoute(config) {
        var routeID = getRouteID();
        var currentRoute = {
            routeID: routeID,
            config: config,
            data: {},
            request: function () {
                return sendRequest(currentRoute);
            }
        };
        return currentRoute;
    }
    /**
     * 路由AJAX请求封装
     * @param routeID 路由ID
     * @param config 路由配置
     */
    function sendRequest(currentRoute) {
        var options = transferToAjaxConfig(currentRoute.config);
        var request = ajax(options);
        request.then(function (resp) {
            var data = onSuccess(currentRoute, resp);
            return data;
        }).catch(function (error) {
            var err = onFail(currentRoute, error);
            throw err;
        });
        return request;
    }
    /**
     * 将路由参数处理为ajax请求的参数
     * @param config
     */
    function transferToAjaxConfig(config) {
        var options = {
            baseURL: configHttp.baseURL,
            url: config.url,
            method: config.method,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            responseType: 'json'
        };
        return options;
    }

    var products = registerRoute({
        name: "获取产品列表",
        method: "get",
        url: "/products"
    });

    registerHttp(function (currentRoute, respData) {
        currentRoute.data = respData.data;
        return currentRoute.data;
    }, function (currentRoute, err) {
        //TODO: show error ui
        console.log("currentRoute.url=\"" + currentRoute.config.url + "\" occured error " + err);
    });
    httpInit("http://localhost:3500");

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") { r = Reflect.decorate(decorators, target, key, desc); }
        else { for (var i = decorators.length - 1; i >= 0; i--) { if (d = decorators[i]) { r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r; } } }
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __spreadArrays() {
        var arguments$1 = arguments;

        for (var s = 0, i = 0, il = arguments.length; i < il; i++) { s += arguments$1[i].length; }
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            { for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                { r[k] = a[j]; } }
        return r;
    }

    var KEY = "__init__";
    function init(target, name, desc) {
        target[KEY] = target[KEY] || [];
        var arr = target[KEY];
        arr.push(name);
    }
    function handleInit(thisCtx) {
        var proto = Object.getPrototypeOf(thisCtx);
        var inits = proto[KEY] || [];
        inits.forEach(function (name) {
            var method = proto[name];
            method.call(thisCtx);
        });
    }

    var KEY$1 = "__http__";
    function http(route) {
        return function (target, name, desc) {
            var arr = target[KEY$1] = target[KEY$1] || [];
            arr.push({
                name: name,
                route: route
            });
        };
    }
    function handleHttp(thisArgs) {
        var proto = Object.getPrototypeOf(thisArgs);
        var arr = proto[KEY$1] || [];
        arr.forEach(function (data) {
            data.route.request().then(function (respData) {
                var method = proto[data.name];
                method.call(thisArgs, respData);
            });
        });
    }

    var KEY$2 = "__after__";
    function after(fn) {
        return function (target, name, desc) {
            var obj = target[KEY$2] = target[KEY$2] || {};
            var arr = obj[name] = obj[name] || [];
            arr.push(fn);
        };
    }
    function handleAfter(thisArgs) {
        var target = Object.getPrototypeOf(thisArgs);
        var obj = target[KEY$2] || {};
        forEach(obj, function (arr, name) {
            var desc = Object.getOwnPropertyDescriptor(target, name);
            var originValue = desc.value;
            desc.value = function () {
                var _this = this;
                var args = Array.prototype.slice.call(arguments);
                var result = originValue.call.apply(originValue, __spreadArrays([this], args));
                forEach(arr, function (fn) {
                    fn.call(_this, result);
                });
                return result;
            };
            Object.defineProperty(target, name, desc);
        });
    }

    function use(thisArgs) {
        handleInit(thisArgs);
        handleHttp(thisArgs);
        handleAfter(thisArgs);
    }

    /**
     * HTML选择器
     * @param selector
     * @param context
     */
    function $$(selector, context) {
        context = context || document;
        var elements = context.querySelectorAll(selector);
        return Array.prototype.slice.call(elements);
    }

    var Products = /** @class */ (function () {
        function Products() {
            use(this);
        }
        Products.prototype.initUI = function () {
            this.context = document.querySelector('#products');
            if (!this.context) {
                throw new Error('init error');
            }
            this.container = $$('.container', this.container)[0];
            this.table = $$('.data-table', this.context)[0];
            this.container.style.display = 'none';
        };
        Products.prototype.showEnterAnimation = function () {
            console.log('show enter animation');
        };
        Products.prototype.loadData = function () {
            console.log(products.data);
            this.renderData(products.data);
        };
        /**
         * 渲染表格数据
         * @param data
         */
        Products.prototype.renderData = function (data) {
            var _this = this;
            var tbody = $$('tbody', this.table)[0];
            data.forEach(function (itemdata) {
                var row = _this.createRow(itemdata);
                tbody.appendChild(row);
            });
        };
        Products.prototype.createRow = function (data) {
            var row = document.createElement('tr');
            row.className = "row";
            row.innerHTML = this.getRowHTML(data);
            return row;
        };
        Products.prototype.getRowHTML = function (data) {
            return "<td>" + data.id + "</td>\n                <td>" + data.name + "</td>\n                <td>" + data.category + "</td>\n                <td>" + data.price + "</td>\n                <td>\n                    <a class=\"cart-icon\" href=\"#\">\u8D2D\u7269\u8F66</a>\n                </td>";
        };
        /**
         * 弹出动画
         */
        Products.prototype.showPopupAnimation = function () {
            console.log("showPopupAnimation");
            this.container.style.display = 'block';
            this.container.classList.add('popup');
        };
        __decorate([
            init
        ], Products.prototype, "initUI", null);
        __decorate([
            init
        ], Products.prototype, "showEnterAnimation", null);
        __decorate([
            http(products)
        ], Products.prototype, "loadData", null);
        __decorate([
            after(Products.prototype.showPopupAnimation)
        ], Products.prototype, "renderData", null);
        return Products;
    }());

    new Products();

}());
//# sourceMappingURL=html.js.map
