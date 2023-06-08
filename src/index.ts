import {
    each,
    merge,
    isString,
    isObject,
    isUndefined,
    queryString,
    labelReplace,
    labelReplaceExp,
    isFunction,
    isNumber
} from "@x-drive/utils";

import RequestError from "./request-error";

/**接口错误时的提示信息 */
type ErrorMsg = {
    /**错误详情 */
    description: string;

    /**错误信息 */
    message: string;

    /**提示类型 */
    type: string;
}

/**环境 */
type Mode = "development" | "production" | "test";

/**出错信息提示格式化函数 */
var notificationMsgFormater = function (msg: ErrorMsg) {
    return msg;
}

interface AnySubject {
    [key: string]: string;
}

/**错误类型 */
type ReqErrorTypes = "Business" | "Net" | "Timeout";

/**请求钩子 */
type ReqHooks = {
    /**请求前钩子 */
    onRequest?: (config?: ReqConf, params?: ReqParams, data?: ReqData) => void;
    /**请求后钩子 */
    onResponse?: (raw?: string, config?: ReqConf, params?: ReqParams, data?: ReqData, req?: XMLHttpRequest) => any;
    /**请求失败钩子 */
    onResponseError?: (re?: any, type?: ReqErrorTypes, config?: ReqConf, req?: XMLHttpRequest) => boolean;
}

/**请求实例设置 */
type ReqSetting = {
    /**请求钩子 */
    hooks?: ReqHooks;

    /**数据字段映射 */
    keys?: {
        /**业务数据字段 */
        data?: string;

        /**状态码字段 */
        code?: string;

        /**返回信息字段 */
        message?: string;

        [key: string]: string;
    };

    /**请求默认配置 */
    config?: ReqConf;
}

var isDev = false;

/**自动提示用的浮层 */
var notification: any;

/**所有 api 存储对象 */
const APIS: Record<string, string> = {};

/**所有域名存储对象 */
const HOSTS: Record<string, string> = {};

/**请求成功状态码 */
var CODE_SUCCESS: number | string = 1;

/**请求方法判断正则 */
const REQ_METHOD_REQ_EXP: RegExp = /get|head|delete/;

/**
 * 网络协议检测正则
 */
const PROTOCOL_REG_EXP: RegExp = /^http[s]?:/i;

/**接口名称声明判断 */
const API_REQ_PATH_REG_EXP: RegExp = /^\//i;

/**
 * 请求配置
 */
interface ReqConf {
    /**是否自动提示接口返回的信息 */
    autoToast?: boolean;

    /**请求数据类型 */
    dataType?: string;

    /**是否添加随机数 */
    fresh?: boolean;

    /**是否携带 cookie */
    credentials?: boolean;

    /**请求头设置 */
    header?: object;

    /**超时时间 */
    timeout?: number;

    /**是否返回原始数据 */
    raw?: boolean;
}

/**
 * 请求参数 (query)
 */
interface ReqParams {
    [propName: string]: any;
}

/**
 * 请求数据 (post)
 */
interface ReqData {
    [propName: string]: any;
}

/**
 * 请求 promise 对象
 */
interface ReqPromise extends Promise<any> {
    [propName: string]: any;
}

/**
 * 各个页面包含的请求
 */
const RequestQueue: object = {};

/**
 * 加入到列表
 * @param  val 请求对象
 */
const pushQueue = function (val: XMLHttpRequest) {
    const pathname = window.location.pathname;
    if (!RequestQueue[pathname]) {
        RequestQueue[pathname] = [];
    }
    RequestQueue[pathname].push(val);
}

/**
 * 从列表删除一个请求
 * @param  val 请求对象
 */
const spliceQueue = function (val: XMLHttpRequest) {
    const pathname = window.location.pathname;
    if (RequestQueue[pathname] && RequestQueue[pathname].length) {
        const index = RequestQueue[pathname].indexOf(val);
        if (index !== -1) {
            RequestQueue[pathname].splice(index, 1);
        }
    }
}

/**
 * 解析生成正确的数据请求地址
 * @param  url    接口别名或具体的请求地址
 * @param  params 请求参数对象
 */
export function resloveUrl(uri: string, params?: ReqParams) {
    var oUri = uri;
    uri = APIS[uri];
    uri = uri || oUri;
    if (isObject(params)) {
        uri = uri.replace(labelReplaceExp, function (_, key) {
            const re = params[key];
            delete params[key];
            return re;
        })
    }
    return uri;
}

var rLogger = console;
var originConsole = true;

/**日志 */
function log(...msg: any[]) {
    var args: string[];
    if (originConsole) {
        args = ["%c[Request]", "color: cyan;", ...msg];
    } else {
        args = msg;
    }
    rLogger.log.apply(rLogger, args);
}

class Request {
    /**默认请求配置 */
    private defConf: ReqConf = {
        "autoToast": true
        , "dataType": "json"
        , "fresh": true
        , "credentials": false
        , "header": {
            "X-Requested-With": "XMLHttpRequest"
        }
        , "timeout": 10000
        , "raw": false
    }

    /**请求钩子 */
    hooks: ReqHooks = {};

    /**字段映射对象 */
    keys: { [key: string]: string } = {
        "data": "data"
        , "code": "code"
        , "message": "message"
    };

    constructor() {
        // @ts-ignore
        const onRequest = (config: ReqConf, params: ReqParams, data: ReqData) => { };
        const onResponse = (raw: string) => {
            return raw;
        }
        // @ts-ignore
        const onResponseError = (re: any) => {
            return true;
        }
        // 默认 hook
        this.hooks = {
            onRequest
            , onResponse
            , onResponseError
        }
    }

    /**检测是否同域用的 a 标签 */
    static A: any = document.createElement("a");

    /**
     * 注册一个请求 api 模块
     * @static
     * @param  subject  模块 api 设置
     * @param  host     api 请求域名
     */
    static register(subject: Record<string, string>, host?: string): void {
        if (isObject(subject)) {
            each(subject, (val, key) => {
                if (APIS[key]) {
                    console.warn(`API ${key} 已被定义`);
                } else {
                    if (!API_REQ_PATH_REG_EXP.test(key)) {
                        key = `/${key}`;
                    }
                    if (isString(host) && !PROTOCOL_REG_EXP.test(val)) {
                        if (!API_REQ_PATH_REG_EXP.test(val)) {
                            val = `/${val}`;
                        }
                        val = `${host}${val}`;
                    } else if (!PROTOCOL_REG_EXP.test(val)) {
                        // 如果接口不以 http 或 https 开头的，则尝试替换里面的占位符
                        // 这里只替换可能存在的 host，所以必须保留其他任何未能解析的花括号
                        val = labelReplace(val, HOSTS, true);
                    }
                    APIS[key] = val;
                }
            })
        }
    }

    /**
     * 放弃当前正在发起的所有请求
     * @param keyname 指定清除的页面请求
     */
    static cancel(keyname?: string) {
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
            } catch (e) {
                console.error(e);
            }
        }
        RequestQueue[pathname] = [];
    }

    /**
     * 生成一个 16 进制的随机数
     */
    static randomStr(): string {
        return (Date.now() + Math.random()).toString(16);
    }

    /**
     * 解析生成正确的数据请求地址
     * @param  url    接口别名或具体的请求地址
     * @param  params 请求参数对象
     */
    resolveUri(uri: string, params: object) {
        return resloveUrl(uri, params);
    }

    /**
     * 处理 post 数据
     * @param data post 数据
     * @return 处理过后的数据
     */
    private parseData(data: string | object) {
        if (isString(data)) {
            return (data as string).replace(/\+/g, "%2B");
        }
        return JSON.stringify(data);
    }

    /**
     * 将对象转化为 form data
     * @param data 要转化成 form data 的数据
     * @return form data
     */
    private parseFormData(data: object): FormData {
        const fd = new FormData();
        if (isObject(data)) {
            each(data, (val: any, key: string) => {
                fd.append(key, val);
            })
        }
        return fd;
    }

    /**
     * 判断是否处于同一个域名下
     * @param url 待判断的地址
     */
    private checkOriginHost(url: string): boolean {
        Request.A.href = url;
        return Request.A.host === window.location.host;
    }

    /**
     * 配置实例中的某些设置
     * @param setting 实例配置对象
     */
    setting(setting?: ReqSetting) {
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

        if (isObject(setting.config)) {
            this.defConf = merge(this.defConf, setting.config);
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
    run<T = AnySubject>(type: string, url: string, params: ReqParams = {}, data: ReqData = {}, config: ReqConf = {}): Promise<T> {
        type = type.toLocaleLowerCase();

        var reqConf: ReqConf = merge(
            this.defConf
            , config
        )

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
            url += `${url.indexOf("?") !== -1 ? "&" : "?"}${queryString(params)}`;
        }

        var xhr = new XMLHttpRequest();
        var req: ReqPromise = new Promise((resolve: Function, reject: Function) => {
            var reqData: string | FormData;
            var header: object = reqConf.header;
            const isCrossOrigin = !this.checkOriginHost(url);

            if (!REQ_METHOD_REQ_EXP.test(type)) {
                if (!header.hasOwnProperty("Content-Type")) {
                    header["Content-Type"] = "application/json";
                }
                if (header["Content-Type"] === null) {
                    // formdata
                    delete header["Content-Type"];
                    reqData = this.parseFormData(data);
                } else {
                    // 默认json
                    reqData = this.parseData(data);
                }
            }

            if (isCrossOrigin) {
                if (reqConf.credentials) {
                    xhr.withCredentials = true;
                }
                delete header["X-Requested-With"];
            }

            if (isNumber(config.timeout)) {
                xhr.timeout = config.timeout;
            }

            xhr.open(type, url, true);

            each(header, (val: string, key: string) => {
                xhr.setRequestHeader(key, val);
            });

            const me = this;
            xhr.onload = function () {
                spliceQueue(this);
                if (this.status >= 200 && this.status < 300 || this.status === 304) {
                    var re: unknown = this.responseText;
                    // 返回钩子
                    if (isFunction(me.hooks.onResponse)) {
                        const hookRe = me.hooks.onResponse.call(me, re, config, params, reqData, this);
                        if (!isUndefined(hookRe)) {
                            re = hookRe;
                        }
                    }

                    if (reqConf.dataType === "json" && isString(re)) {
                        try {
                            re = JSON.parse(re as string);
                        } catch (err) {
                            reject(err);
                            return;
                        }
                    }

                    const data = isObject(re) ? re[me.keys.data] : re;
                    const code = isObject(re) ? re[me.keys.code] : null;

                    if (Number(code) !== CODE_SUCCESS) {
                        const message: string = re[me.keys.message];
                        if (reqConf.autoToast && message && notification) {
                            notification(
                                notificationMsgFormater({
                                    "description": message
                                    , "message": "请求错误"
                                    , "type": "fail"
                                })
                            );
                        }
                        me.hooks.onResponseError(re, "Business", reqConf, this);
                        return reject(re);
                    }

                    resolve(
                        config.raw ? re : data || {}
                    );
                } else {
                    me.hooks.onResponseError({}, "Net", reqConf, this);
                    reject(
                        new RequestError(`${this.status} Error`, this.status)
                    );
                }
            }

            xhr.onerror = function () {
                me.hooks.onResponseError({}, "Net", reqConf, this);
                reject(
                    new RequestError(`Net Error, [${type}] >> ${url}`, this.status)
                );
            }

            xhr.ontimeout = xhr.onerror = function () {
                spliceQueue(this);
                me.hooks.onResponseError({}, "Timeout", reqConf, this);
                reject(
                    new RequestError(`Request timeout, [${type}] >> ${url}`, this.status)
                );
            }

            xhr.send(reqData);
        })

        req.abort = function () {
            xhr.abort();
            spliceQueue(xhr);
        }
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
    get<T = AnySubject>(url: string, param?: ReqParams, config?: ReqConf) {
        return this.run<T>("GET", url, param, {}, config);
    }

    /**
     * 发起一个 post 请求
     * @param    url      请求url或别名
     * @param    param    请求参数
     * @param    data     请求数据
     * @param    config   请求配置
     * @returns
     */
    post<T = AnySubject>(url: string, param?: ReqParams, data?: ReqData, config?: ReqConf) {
        if (isObject(param) && isUndefined(data)) {
            data = param;
            param = {};
        }
        if (isUndefined(data)) {
            data = {};
        }
        return this.run<T>("POST", url, param, data, config);
    }
}

export { Request as R };

type ConfigOption = {
    /**请求成功时的状态码 */
    successCode?: number | string;

    /**域名配置 */
    hosts?: Record<string, string>;

    /**api 别名 */
    apis?: Record<string, string>;

    /**提示浮层 */
    notifyMod?: any;

    /**提示信息格式化函数 */
    notifyMsgFormater?: (msg: ErrorMsg) => any;

    /**日志模块 */
    logger?: any;
}

/**
 * 设置请求模块
 * @param config 模块配置
 * @param mode   所处环境
 */
function config(config: ConfigOption, mode: Mode = "production") {
    isDev = mode !== "production";

    const { successCode, hosts, apis, notifyMod, notifyMsgFormater, logger } = config;

    if (!isUndefined(successCode)) {
        CODE_SUCCESS = successCode;
    }

    if (isObject(hosts)) {
        each(hosts, function (val, key) {
            HOSTS[key] = val;
        });
    }

    if (isObject(apis)) {
        Request.register(apis)
    }

    if (!isUndefined(notifyMod)) {
        notification = notifyMod;
    }

    if (isFunction(notifyMsgFormater)) {
        notificationMsgFormater = notifyMsgFormater;
    }

    if (logger && isFunction(logger.log)) {
        originConsole = false;
        rLogger = logger;
    }

    if (isDev) {
        log("config", "->", config);
    }
}

export { config }

export default new Request();