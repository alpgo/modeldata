import * as utils from '@modeldata/utils';

/**
 * Trim excess whitespace off the beginning and end of a string
 * @param str The String to trim
 * @returns The String freed of excess whitespace
 */
export function trim(str: string): string
{
    return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Build a URL by appending params to the end
 * @param url - The base of the url (e.g., http://www.google.com)
 * @param params - The params to be appended
 * @returns The formatted url
 */
export function buildURL(url: string, params: { [key: string]: any })
{
    if (!params) {
        return url;
    }

    var parts: string[] = [];
    utils.forEach(params, function (val: string, key: string)
    {
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
export function isAbsoluteURL(url: string): boolean
{
    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
    // by any combination of letters, digits, plus, period, or hyphen.
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 * @param baseURL The base URL
 * @param requestedURL Absolute or relative URL to combine
 * @returns The combined full path
 */
export function buildFullPath(baseURL: string, requestedURL: string): string
{
    if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
};

/**
 * Creates a new URL by combining the specified URLs
 * @param baseURL The base URL
 * @param relativeURL The relative URL
 * @returns The combined URL
 */
export function combineURLs(baseURL: string, relativeURL: string): string
{
    return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL;
};

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
export function parseHeaders(headers: string): Object
{
    var parsed: { [key: string]: string } = {};
    var key;
    var val;
    var i;

    if (!headers) { return parsed; }

    utils.forEach(headers.split('\n'), function parser(line: string)
    {
        i = line.indexOf(':');
        key = trim(line.substr(0, i)).toLowerCase();
        val = trim(line.substr(i + 1));

        if (key) {
            parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
        }
    });

    return parsed;
};