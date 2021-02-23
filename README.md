# Http 请求模块

> 简易的支持自动域名替换、接口别名的请求模块

## 模块设置
- 如果希望使用别名、自动域名替换、修改请求成功状态码、失败自动提示功能，需要在业务模块调用前使用模块 `config` 方法对模块进行设置。
    ```ts
    config(config: ConfigOption): void;
    ```
    `config` 对象支持配置参数：
    - `successCode` 请求成功时的状态码
    - `hosts` 域名配置
    - `apis` api 别名
    - `notifyMod` 提示浮层

    ```javascript
    import { config } from "@x-drive/request";
    config({
        // 将请求成功状态码修改为 233
        "successCode": "233"
        // 指定了 product 业务的地址
        , "hosts": {
            "product": "http://api.test.dev"
        }
        // 设置了 /home 业务的别名
        , "apis": {
            "/home": "/api/hahaha/home"
        }
    });
    ```
- 模块目前支持请求前及请求后钩子，该功能只支持实例级别的设置
    ```ts
    import Request from "@x-drive/request";
    // 全局请求实例设置
    Request.setting({
        "hooks": {
            onRequest(conf) {
                console.log(conf);
            }
            , onResponse(raw) {
                console.log(raw);
                return raw;
            }
        }
    });
    ```

## 使用方式

### 请求方法
- `get` 发起一个 get 请求 
    ```ts
    get(url: string, param?: ReqParams, config?: ReqConf)
    ```
    - `url`     请求url或别名
    - `param`   请求参数
    - `config`  请求配置

- `post` 发起一个 post 请求
     ```ts
    post(url: string, param?: ReqParams, data?: ReqData, config?: ReqConf)
    ```
    - `url`     请求url或别名
    - `param`   请求参数
    - `data`    请求数据
    - `config`  请求配置

- `run` 执行任意类型请求
     ```ts
    run<T>(type: string, url: string, params: ReqParams = {}, data: ReqData = {}, config: ReqConf = {}): Promise<T>
    ```
    - `type`    请求类型
    - `url`     请求url或别名
    - `param`   请求参数
    - `data`    请求数据
    - `config`  请求配置


- `resolveUri` 解析生成正确的数据请求地址
     ```ts
    resolveUri(uri: string, params: object)
    ```
    - `uri`    接口别名或具体的请求地址
    - `params` 请求参数对象
- `cancel` 放弃当前正在发起的所有请求 
     ```ts
    cancel()
    ```
- `randomStr` 生成一个 16 进制的随机数
     ```ts
    randomStr(): string
    ```

### 额外的实例

模块默认在全局会生成一个通用的请求实例，方便对所有的请求进行管理。同时也以 `R` 导出了模块，支持使用者单独实例化另外的请求实例用于其他用途。