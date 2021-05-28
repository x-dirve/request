/**接口错误时的提示信息 */
declare type ErrorMsg = {
    /**错误详情 */
    description: string;
    /**错误信息 */
    message: string;
    /**提示类型 */
    type: string;
};
/**环境 */
declare type Mode = "development" | "production" | "test";
interface AnySubject {
    [key: string]: string;
}
/**错误类型 */
declare type ReqErrorTypes = "Business" | "Net" | "Timeout";
/**请求钩子 */
declare type ReqHooks = {
    /**请求前钩子 */
    onRequest?: (config?: ReqConf, params?: ReqParams, data?: ReqData) => void;
    /**请求后钩子 */
    onResponse?: (raw?: string, config?: ReqConf, params?: ReqParams, data?: ReqData) => any;
    /**请求失败钩子 */
    onResponseError?: (re?: any, type?: ReqErrorTypes, config?: ReqConf) => boolean;
};
/**请求实例设置 */
declare type ReqSetting = {
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
};
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
 * 解析生成正确的数据请求地址
 * @param  {String} url    接口别名或具体的请求地址
 * @param  {Object} params 请求参数对象
 * @return {String}
 */
export declare function resloveUrl(uri: string, params?: ReqParams): string;
declare class Request {
    /**默认请求配置 */
    private defConf;
    /**请求钩子 */
    hooks: ReqHooks;
    /**字段映射对象 */
    keys: {
        [key: string]: string;
    };
    constructor();
    /**检测是否同域用的 a 标签 */
    static A: any;
    /**
     * 注册一个请求 api 模块
     * @static
     * @param  subject  模块 api 设置
     * @param  host     api 请求域名
     */
    static register(subject: Record<string, string>, host?: string): void;
    /**
     * 放弃当前正在发起的所有请求
     */
    static cancel(): void;
    /**
     * 生成一个 16 进制的随机数
     */
    static randomStr(): string;
    /**
     * 解析生成正确的数据请求地址
     * @param  url    接口别名或具体的请求地址
     * @param  params 请求参数对象
     */
    resolveUri(uri: string, params: object): string;
    /**
     * 处理 post 数据
     * @param data post 数据
     * @return 处理过后的数据
     */
    private parseData;
    /**
     * 将对象转化为 form data
     * @param data 要转化成 form data 的数据
     * @return form data
     */
    private parseFormData;
    /**
     * 判断是否处于同一个域名下
     * @param url 待判断的地址
     */
    private checkOriginHost;
    /**
     * 配置实例中的某些设置
     * @param setting 实例配置对象
     */
    setting(setting?: ReqSetting): void;
    /**
     * 执行请求
     * @param    type    请求类型
     * @param    url     请求url或别名
     * @param    param   请求参数
     * @param    data    请求数据
     * @param    config  请求配置
     * @returns          请求 Promise 对象
     */
    run<T = AnySubject>(type: string, url: string, params?: ReqParams, data?: ReqData, config?: ReqConf): Promise<T>;
    /**
     * 发起一个 get 请求
     * @param   url     请求url或别名
     * @param   param   请求参数
     * @param   config  请求配置
     * @returns
     */
    get<T = AnySubject>(url: string, param?: ReqParams, config?: ReqConf): Promise<T>;
    /**
     * 发起一个 post 请求
     * @param    url      请求url或别名
     * @param    param    请求参数
     * @param    data     请求数据
     * @param    config   请求配置
     * @returns
     */
    post<T = AnySubject>(url: string, param?: ReqParams, data?: ReqData, config?: ReqConf): Promise<T>;
}
export { Request as R };
declare type ConfigOption = {
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
};
/**
 * 设置请求模块
 * @param config 模块配置
 * @param mode   所处环境
 */
declare function config(config: ConfigOption, mode?: Mode): void;
export { config };
declare const _default: Request;
export default _default;
