/*!
 * @modeldata/laya - v1.0.0
 * Compiled Wed, 01 Jan 2020 12:52:20 UTC
 *
 * @modeldata/laya is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
(function () {
    'use strict';

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
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) { if (b.hasOwnProperty(p)) { d[p] = b[p]; } } };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

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
    //# sourceMappingURL=init.js.map

    var KEY$1 = "__http__";
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
    //# sourceMappingURL=http.js.map

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
    //# sourceMappingURL=forEach.js.map

    var KEY$2 = "__after__";
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
    //# sourceMappingURL=after.js.map

    function use(thisArgs) {
        handleInit(thisArgs);
        handleHttp(thisArgs);
        handleAfter(thisArgs);
    }
    //# sourceMappingURL=use.js.map

    var Homepage = /** @class */ (function (_super) {
        __extends(Homepage, _super);
        function Homepage() {
            var _this = _super.call(this) || this;
            use(_this);
            return _this;
        }
        Homepage.prototype.loadRes = function () {
            var skins = './images/button-1.png';
            Laya.loader.load(skins, Laya.Handler.create(this, this.onUIAssetsLoaded));
        };
        Homepage.prototype.onUIAssetsLoaded = function () {
            var btn = new Laya.Button('./images/button-1.png');
            Laya.stage.addChild(btn);
            return btn;
        };
        __decorate([
            init
        ], Homepage.prototype, "loadRes", null);
        return Homepage;
    }(Laya.Sprite));

    var Main = /** @class */ (function () {
        function Main() {
            use(this);
        }
        Main.prototype.initStage = function () {
            Laya.init(Laya.Browser.clientWidth, Laya.Browser.clientHeight, Laya.WebGL);
            Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
            Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
            Laya.stage.scaleMode = "showall";
            Laya.stage.bgColor = "#232628";
        };
        Main.prototype.initHttp = function () {
            this.registerHttpMiddleware();
        };
        Main.prototype.registerHttpMiddleware = function () {
        };
        Main.prototype.createView = function () {
            Laya.stage.addChild(new Homepage());
        };
        __decorate([
            init
        ], Main.prototype, "initStage", null);
        __decorate([
            init
        ], Main.prototype, "initHttp", null);
        __decorate([
            init
        ], Main.prototype, "createView", null);
        return Main;
    }());
    //# sourceMappingURL=index.js.map

    new Main();
    //# sourceMappingURL=index.js.map

}());
//# sourceMappingURL=laya.js.map
