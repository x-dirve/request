declare type ApiSubject = {
    [key: string]: string;
};
declare type HostSubject = {
    [name: string]: string;
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
    /**检测是否同域用的 a 标签 */
    static A: any;
    /**
     * 注册一个请求 api 模块
     * @static
     * @param  subject  模块 api 设置
     * @param  host     api 请求域名
     */
    static register(subject: ApiSubject, host?: string): void;
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
     * @param {String} url    接口别名或具体的请求地址
     * @param {Object} params 请求参数对象
     * @return {String}
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
     * 执行请求
     * @param   {String}  type    请求类型
     * @param   {String}  url     请求url或别名
     * @param   {Object}  param   请求参数
     * @param   {Object}  data    请求数据
     * @param   {ReqConf} config  请求配置
     * @returns {Object}          请求 Promise 对象
     */
    run<T>(type: string, url: string, params?: ReqParams, data?: ReqData, config?: ReqConf): Promise<T>;
    /**
     * 发起一个 get 请求
     * @param   {String}   url     请求url或别名
     * @param   {Object}   param   请求参数
     * @param   {ReqConf}  config  请求配置
     * @returns {Object}
     */
    get(url: string, param?: ReqParams, config?: ReqConf): Promise<unknown>;
    /**
     * 发起一个 post 请求
     * @param   {String}  url      请求url或别名
     * @param   {Object}  param    请求参数
     * @param   {Object}  data     请求数据
     * @param   {ReqConf} config  请求配置
     * @returns {Object}
     */
    post(url: string, param?: ReqParams, data?: ReqData, config?: ReqConf): Promise<unknown>;
}
export { Request as R };
declare type ConfigOption = {
    /**请求成功时的状态码 */
    successCode: number | string;
    /**域名配置 */
    hosts: HostSubject;
    /**api 别名 */
    apis: ApiSubject;
    /**提示浮层 */
    notifyMod: any;
};
/**
 * 设置请求模块
 * @param config 模块配置
 */
declare function config(config: ConfigOption): void;
export { config };
declare const _default: Request;
export default _default;