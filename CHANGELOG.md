## v1.0.18

### Feat
- feat: 请求 reject 函数传入请求错误实例，可使用实例 code 或 cause 字段的错误码处理错误 [1587a1d](https://github.com/x-dirve/request/commit/1587a1d0a5e84c89fd4349c510bbb7dc4371e9df)

### Fix
- fix: 修复使用外部 looger 时的显示问题 [62fc6b2](https://github.com/x-dirve/request/commit/62fc6b27e5a65786bf8e7eac7d333b98525729b4)

## v1.0.17

### Fix
- fix: 修复使用外部 logger 时的显示问题 [62fc6b2](https://github.com/x-dirve/request/commit/62fc6b27e5a65786bf8e7eac7d333b98525729b4)

## v1.0.16

### Feat
- feat: 增加 logger 配置项 [e77059b](https://github.com/x-dirve/request/commit/e77059b4da020b8fc70df82001bac80aec542574)

## v1.0.15

### Fix
- fix: 修正接口带参数时随机数拼接错误的问题 [434357e](https://github.com/x-dirve/request/commit/434357e045bfc497a762afd25f69539b32a50b2f)

## v1.0.14

### Fix
- fix: cancel 方法的参数改为非必传 [07d057b](https://github.com/x-dirve/request/commit/07d057b8ff6df13351749f627131e43f02d8a7ed)

## v1.0.13

### Feat
- feat: cancel 方法支持清除指定页面的请求 [f93d091](https://github.com/x-dirve/request/commit/f93d0918923ba13d7242c70c1bab18bc1148e395)

## v1.0.12

### Feat
- feat: 增加 onResponseError 钩子，更新相关说明文档 [99b3425](https://github.com/x-dirve/request/commit/99b3425dac610e3f8366c8827cdd3f1d025dfd92)

## v1.0.11

### Fix
- fix: config 函数第二个参数接收的环境名称由 dev | prod 改为 development | production | test [1feb8e1](https://github.com/x-dirve/request/commit/1feb8e1a7b2ff515b50d23aae4fd2179dcdac73c)

## v1.0.10

### Feat
- feat: 配置相关 log 只会在开发环境中输出 [ca80117](https://github.com/x-dirve/request/commit/ca8011701cd4d813c1362a80c39ace41e702c8ea)

## v1.0.9

### Feat
- feat: 新增请求错误处理钩子 [9622e65](https://github.com/x-dirve/request/commit/9622e65a3aac3ee6bc124dc0dbf5b7a2325ea936)

## v1.0.8

### Fix
- fix: 修正 get、post 返回类型定义问题 [55aba7e](https://github.com/x-dirve/request/commit/55aba7e44f679a1cbda4203611344806be97803e)

## v1.0.7

### Feat
- feat: 支持 umd 模式 [5c752dd](https://github.com/x-dirve/request/commit/5c752dd850bf6ac262cbb193c6bbe03b0eba8813)

## v1.0.6

### Fix
- fix: ReqSetting 中的配置应都是可选项 [79d8dbc](https://github.com/x-dirve/request/commit/79d8dbca68424d2b96357b61b8b9721024762284)

## v1.0.5

### Feat
- feat: 支持配置数据字段映射 [a170d5c](https://github.com/x-dirve/request/commit/a170d5c11a4cae21421c6679a4de9e9846ab581b)

## v1.0.4

### Fix
- fix: 修复 onRequest hook 参数错误问题 [56f85a7](https://github.com/x-dirve/request/commit/56f85a7f4bcbd9502e93127f4276e23c4b7d3e8e)

## v1.0.3

### Feat
- feat: 设置模块时输出设置信息，修改提示调用方式 [d2e5984](https://github.com/x-dirve/request/commit/d2e5984023b1a416003699622424217693d5af06)

## v1.0.2

### Fix
- fix: 修复请求打开前设置请求头报错的问题 [a4b3812](https://github.com/x-dirve/request/commit/a4b3812a0b58fe2bfa15c7dc8e87f74dd58acd30)

### Feat
- feat: 增加请求前及请求后钩子支持 [62edc13](https://github.com/x-dirve/request/commit/62edc1348d0baae61c7ef5b45dcd6867d75b2986)
- feat: 增加错误提示信息数据格式化函数支持 [7ec63d2](https://github.com/x-dirve/request/commit/7ec63d221153a20d6c25e0a15d5a3e7d8e03c8da)

## v1.0.1

### Fix
- fix: config 方法所有配置都是可选项 [c585715](https://github.com/x-dirve/request/commit/c585715c6e50d15933f11b1a37bcfd8364a807a6)

## v1.0.0

### Feat
- feat: 首次发布版，除了正常的 http 请求外，支持初始化时设置别名、自动域名替换、修改请求成功状态码、失败自动提示等功能 [b2bb504](https://github.com/x-dirve/request/commit/b2bb5041d407f0ec4b70a4eea62a275bffe3f9a2)

