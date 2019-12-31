/**
 * ajax函数的参数类型(即路由接口的配置数据)
 */
export interface AjaxConfigType
{
    data?: string | Document | Blob | ArrayBufferView | ArrayBuffer | FormData | URLSearchParams | ReadableStream<Uint8Array>,
    headers?: { [key: string]: string },
    baseURL: string,
    url: string,
    method: string,
    timeout?: number,
    responseType: string;
    params?: Object,
    withCredentials?: boolean
}

/**
 * ajax接口调用成功返回的数据结构
 */
export interface AjaxResponseType
{
    data: any;
    status: number;
    statusText: string;
    headers: Object;
    config: AjaxConfigType;
    request: XMLHttpRequest;
}

/**
 * ajax接口调用失败传递给错误函数(createError)的数据结构
 */
export interface AjaxErrorResponseType
{
    message: string;
    config: AjaxConfigType;
    code?: string;
    request: XMLHttpRequest,
    response?: AjaxResponseType
}

/**
 * Ajax调用发生错误返回的错误类型
 */
export interface AjaxError extends Error
{
    config: AjaxConfigType;
    code?: string;
    request: XMLHttpRequest;
    response?: AjaxResponseType;
    toJSON(): Object;
}