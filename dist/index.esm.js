/**
 * 数据类型判断
 * @param  subject 待判断的数据
 * @param  type    数据类型名字
 * @return         判断结果
 */
function is(subject, type) {
    return Object.prototype.toString.call(subject).substr(8, type.length).toLowerCase() === type;
}

/**
 * 是否是数组
 * @param  subject 待判断的数据
 */
function isObject(subject) {
    return is(subject, "object");
}

/**
 * 是否 undefined
 * @param  subject 待判断的数据
 */
function isUndefined(subject) {
    return is(subject, "undefined");
}

/**
 * 带花括号标签检测正则
 * @type {RegExp}
 */
var labelReplaceExp = /\{(\w+)\}/g;
/**
 * 批量替换字符串中带花括号标签为指定数据
 * @param  tpl  待处理的字符串
 * @param  data 替换数据
 * @param  keep 是否保留未能解析的标签
 * @return      替换后端字符串
 * @example
 * ```tsx
 * labelReplace('{a}/{b}/c', {a: 1, b: 2}) // 1/2/c
 * labelReplace('{a}/{b}/c', {a: 1}, true) // 1/{b}/c
 * ```
 */
function labelReplace(tpl, data, keep) {
    if ( keep === void 0 ) keep = false;

    return tpl.replace(labelReplaceExp, function (_, key) {
        var re = isObject(data) ? data[key] : data;
        if (isUndefined(re) && keep) {
            return _;
        }
        return re;
    });
}

/**
 * 是否是函数
 * @param  subject 待判断的数据
 */
function isFunction(subject) {
    return is(subject, "function");
}

/**
 * 是否是数组
 * @param  subject 待判断的数据
 */
function isArray(subject) {
    return Array.isArray(subject);
}

/**
 * 通用遍历函数
 * @param  data    待遍历数据
 * @param  handler 处理函数
 * @param  context 作用域
 */
function each(data, handler, context) {
    context = context || this;
    var hasHandler = isFunction(handler);
    if (isArray(data)) {
        for (var i = 0; i < data.length; i++) {
            var re = true;
            if (hasHandler) {
                re = handler.call(context, data[i], i);
            }
            if (re === false) {
                break;
            }
        }
    }
    else if (isObject(data)) {
        var keys = Object.keys(data);
        for (var i$1 = 0; i$1 < keys.length; i$1++) {
            var re$1 = true;
            if (hasHandler) {
                re$1 = handler.call(context, data[keys[i$1]], keys[i$1]);
            }
            if (re$1 === false) {
                break;
            }
        }
    }
}

/**
 * 合并
 * @param target  合并基准对象
 * @param sources 后续合并对象
 */
function merge(target) {
    var obj, obj$1;

    var sources = [], len = arguments.length - 1;
    while ( len-- > 0 ) sources[ len ] = arguments[ len + 1 ];
    if (!sources.length)
        { return target; }
    var source = sources.shift();
    if (isObject(target) && isObject(source)) {
        for (var key in source) {
            if (isObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, ( obj = {}, obj[key] = {}, obj ));
                }
                merge(target[key], source[key]);
            }
            else {
                Object.assign(target, ( obj$1 = {}, obj$1[key] = source[key], obj$1 ));
            }
        }
    }
    return merge.apply(void 0, [ target ].concat( sources ));
}

/**
 * 是否是字符串
 * @param  subject 待判断的数据
 */
function isString(subject) {
    return is(subject, "string");
}

/**
 * 是否是数字
 * @param  subject 待判断的数据
 */
function isNumber(subject) {
    return !isNaN(subject) && is(subject, "number");
}

/**
 * 请求参数对象转成请求参数字符串
 * @param dat 请求参数
 */
function queryString(dat) {
    var queryStr;
    if (dat) {
        queryStr = Object.keys(dat)
            .map(function (key) {
            return (key + "=" + (encodeURIComponent(dat[key])));
        })
            .join('&');
    }
    else {
        queryStr = '';
    }
    return queryStr;
}

/**出错信息提示格式化函数 */
var notificationMsgFormater = function (msg) {
    return msg;
};
var isDev = false;
/**自动提示用的浮层 */
var notification;
/**所有 api 存储对象 */
const APIS = {};
/**所有域名存储对象 */
const HOSTS = {};
/**请求成功状态码 */
var CODE_SUCCESS = 1;
/**请求方法判断正则 */
const REQ_METHOD_REQ_EXP = /get|head|delete/;
/**
 * 网络协议检测正则
 */
const PROTOCOL_REG_EXP = /^http[s]?:/i;
/**接口名称声明判断 */
const API_REQ_PATH_REG_EXP = /^\//i;
/**
 * 各个页面包含的请求
 */
const RequestQueue = {};
/**
 * 加入到列表
 * @param  val 请求对象
 */
const pushQueue = function (val) {
    const pathname = window.location.pathname;
    if (!RequestQueue[pathname]) {
        RequestQueue[pathname] = [];
    }
    RequestQueue[pathname].push(val);
};
/**
 * 从列表删除一个请求
 * @param  val 请求对象
 */
const spliceQueue = function (val) {
    const pathname = window.location.pathname;
    if (RequestQueue[pathname] && RequestQueue[pathname].length) {
        const index = RequestQueue[pathname].indexOf(val);
        if (index !== -1) {
            RequestQueue[pathname].splice(index, 1);
        }
    }
};
/**
 * 解析生成正确的数据请求地址
 * @param  url    接口别名或具体的请求地址
 * @param  params 请求参数对象
 */
function resloveUrl(uri, params) {
    var oUri = uri;
    uri = APIS[uri];
    uri = uri || oUri;
    if (isObject(params)) {
        uri = uri.replace(labelReplaceExp, function (_, key) {
            const re = params[key];
            delete params[key];
            return re;
        });
    }
    return uri;
}
/**日志 */
function log(...msg) {
    console.log.call(console, "%c[Request]", "color: cyan;", ...msg);
}
class Request {
    constructor() {
        /**默认请求配置 */
        this.defConf = {
            "autoToast": true,
            "dataType": "json",
            "fresh": true,
            "credentials": false,
            "header": {
                "X-Requested-With": "XMLHttpRequest"
            },
            "timeout": 10000,
            "raw": false
        };
        /**请求钩子 */
        this.hooks = {};
        /**字段映射对象 */
        this.keys = {
            "data": "data",
            "code": "code",
            "message": "message"
        };
        // @ts-ignore
        const onRequest = (config, params, data) => { };
        const onResponse = (raw) => {
            return raw;
        };
        // @ts-ignore
        const onResponseError = (re) => {
            return true;
        };
        // 默认 hook
        this.hooks = {
            onRequest,
            onResponse,
            onResponseError
        };
    }
    /**
     * 注册一个请求 api 模块
     * @static
     * @param  subject  模块 api 设置
     * @param  host     api 请求域名
     */
    static register(subject, host) {
        if (isObject(subject)) {
            each(subject, (val, key) => {
                if (APIS[key]) {
                    console.warn(`API ${key} 已被定义`);
                }
                else {
                    if (!API_REQ_PATH_REG_EXP.test(key)) {
                        key = `/${key}`;
                    }
                    if (isString(host) && !PROTOCOL_REG_EXP.test(val)) {
                        if (!API_REQ_PATH_REG_EXP.test(val)) {
                            val = `/${val}`;
                        }
                        val = `${host}${val}`;
                    }
                    else if (!PROTOCOL_REG_EXP.test(val)) {
                        // 如果接口不以 http 或 https 开头的，则尝试替换里面的占位符
                        // 这里只替换可能存在的 host，所以必须保留其他任何未能解析的花括号
                        val = labelReplace(val, HOSTS, true);
                    }
                    APIS[key] = val;
                }
            });
        }
    }
    /**
     * 放弃当前正在发起的所有请求
     * @param keyname 指定清除的页面请求
     */
    static cancel(keyname) {
        const pathname = isString(keyname) ? keyname : window.location.pathname;
        var nowReqs = RequestQueue[pathname];
        if (nowReqs && nowReqs.length) {
            try {
                for (var name in nowReqs) {
                    let req = nowReqs[name];
                    if (req) {
                        req.abort();
                    }
                }
            }
            catch (e) {
                console.error(e);
            }
        }
        RequestQueue[pathname] = [];
    }
    /**
     * 生成一个 16 进制的随机数
     */
    static randomStr() {
        return (Date.now() + Math.random()).toString(16);
    }
    /**
     * 解析生成正确的数据请求地址
     * @param  url    接口别名或具体的请求地址
     * @param  params 请求参数对象
     */
    resolveUri(uri, params) {
        return resloveUrl(uri, params);
    }
    /**
     * 处理 post 数据
     * @param data post 数据
     * @return 处理过后的数据
     */
    parseData(data) {
        if (isString(data)) {
            return data.replace(/\+/g, "%2B");
        }
        return JSON.stringify(data);
    }
    /**
     * 将对象转化为 form data
     * @param data 要转化成 form data 的数据
     * @return form data
     */
    parseFormData(data) {
        const fd = new FormData();
        if (isObject(data)) {
            each(data, (val, key) => {
                fd.append(key, val);
            });
        }
        return fd;
    }
    /**
     * 判断是否处于同一个域名下
     * @param url 待判断的地址
     */
    checkOriginHost(url) {
        Request.A.href = url;
        return Request.A.host === window.location.host;
    }
    /**
     * 配置实例中的某些设置
     * @param setting 实例配置对象
     */
    setting(setting) {
        if (!isObject(setting)) {
            return;
        }
        if (isDev) {
            log("setting", "->", setting);
        }
        if (isObject(setting.hooks)) {
            this.hooks = merge(this.hooks, setting.hooks);
        }
        if (isObject(setting.keys)) {
            this.keys = merge(this.keys, setting.keys);
        }
    }
    /**
     * 执行请求
     * @param    type    请求类型
     * @param    url     请求url或别名
     * @param    param   请求参数
     * @param    data    请求数据
     * @param    config  请求配置
     * @returns          请求 Promise 对象
     */
    run(type, url, params = {}, data = {}, config = {}) {
        type = type.toLocaleLowerCase();
        var reqConf = merge(this.defConf, config);
        if (reqConf.fresh) {
            // 有强制刷新设置则自动追加随机数
            params._ = Request.randomStr();
        }
        // 请求钩子
        if (isFunction(this.hooks.onRequest)) {
            this.hooks.onRequest.call(this, reqConf, params, data);
        }
        // 解析地址
        url = this.resolveUri(url, params);
        // 处理 query 参数
        if (isObject(params)) {
            url += `?${queryString(params)}`;
        }
        var xhr = new XMLHttpRequest();
        var req = new Promise((resolve, reject) => {
            var reqData;
            var header = reqConf.header;
            const isCrossOrigin = !this.checkOriginHost(url);
            if (!REQ_METHOD_REQ_EXP.test(type)) {
                if (!header.hasOwnProperty("Content-Type")) {
                    header["Content-Type"] = "application/json";
                }
                if (header["Content-Type"] === null) {
                    // formdata
                    delete header["Content-Type"];
                    reqData = this.parseFormData(data);
                }
                else {
                    // 默认json
                    reqData = this.parseData(data);
                }
            }
            if (isCrossOrigin) {
                if (config.credentials) {
                    xhr.withCredentials = true;
                }
                delete header["X-Requested-With"];
            }
            if (isNumber(config.timeout)) {
                xhr.timeout = config.timeout;
            }
            xhr.open(type, url, true);
            each(header, (val, key) => {
                xhr.setRequestHeader(key, val);
            });
            const me = this;
            xhr.onload = function () {
                spliceQueue(this);
                if (this.status >= 200 && this.status < 300 || this.status === 304) {
                    var re = this.responseText;
                    // 返回钩子
                    if (isFunction(me.hooks.onResponse)) {
                        me.hooks.onResponse.call(me, re, config, params, reqData);
                    }
                    if (reqConf.dataType === "json") {
                        try {
                            re = JSON.parse(re);
                        }
                        catch (err) {
                            reject(err);
                            return;
                        }
                    }
                    const data = re[me.keys.data];
                    const code = re[me.keys.code];
                    if (Number(code) !== CODE_SUCCESS) {
                        const message = re[me.keys.message];
                        if (reqConf.autoToast && message && notification) {
                            notification(notificationMsgFormater({
                                "description": message,
                                "message": "请求错误",
                                "type": "fail"
                            }));
                        }
                        me.hooks.onResponseError(re, "Business", reqConf);
                        return reject(re);
                    }
                    resolve(config.raw ? re : data || {});
                }
                else {
                    reject(new Error(`Request Error, status [${this.status}]`));
                }
            };
            xhr.onerror = function () {
                me.hooks.onResponseError({}, "Net", reqConf);
                reject(new Error(`Request Error,[${type}] >> ${url}`));
            };
            xhr.ontimeout = xhr.onerror = function (e) {
                spliceQueue(this);
                me.hooks.onResponseError({}, "Timeout", reqConf);
                reject(e);
            };
            xhr.send(reqData);
        });
        req.abort = function () {
            xhr.abort();
            spliceQueue(xhr);
        };
        pushQueue(xhr);
        return req;
    }
    /**
     * 发起一个 get 请求
     * @param   url     请求url或别名
     * @param   param   请求参数
     * @param   config  请求配置
     * @returns
     */
    get(url, param, config) {
        return this.run("GET", url, param, {}, config);
    }
    /**
     * 发起一个 post 请求
     * @param    url      请求url或别名
     * @param    param    请求参数
     * @param    data     请求数据
     * @param    config   请求配置
     * @returns
     */
    post(url, param, data, config) {
        if (isObject(param) && isUndefined(data)) {
            data = param;
            param = {};
        }
        if (isUndefined(data)) {
            data = {};
        }
        return this.run("POST", url, param, data, config);
    }
}
/**检测是否同域用的 a 标签 */
Request.A = document.createElement("a");
/**
 * 设置请求模块
 * @param config 模块配置
 * @param mode   所处环境
 */
function config(config, mode = "production") {
    isDev = mode !== "production";
    const { successCode, hosts, apis, notifyMod, notifyMsgFormater } = config;
    if (isDev) {
        log("config", "->", config);
    }
    if (!isUndefined(successCode)) {
        CODE_SUCCESS = successCode;
    }
    if (isObject(hosts)) {
        each(hosts, function (val, key) {
            HOSTS[key] = val;
        });
    }
    if (isObject(apis)) {
        Request.register(apis);
    }
    if (!isUndefined(notifyMod)) {
        notification = notifyMod;
    }
    if (isFunction(notifyMsgFormater)) {
        notificationMsgFormater = notifyMsgFormater;
    }
}
var index = new Request();

export default index;
export { Request as R, config, resloveUrl };
//# sourceMappingURL=index.esm.js.map
