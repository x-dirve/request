declare class RequestError extends Error {
    /**错误码 */
    code: number;
    /**错误名称 */
    name: string;
    constructor(message: string, code: number);
}
export default RequestError;
