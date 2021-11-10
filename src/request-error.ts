class RequestError extends Error {
    /**错误码 */
    code:number = -1;
    
    /**错误名称 */
    name = "RequestError";

    constructor(message:string, code:number) {
        // @ts-ignore
        super(message, {"cause": code});
        this.code = code;
    }
}

export default RequestError;