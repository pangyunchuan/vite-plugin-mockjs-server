## 安装

```text
npm install vite-plugin-mockjs-server -D

```

## 说明

```text
在vite中使用mockjs 服务
只能在开发模式中使用,无法再打包时构建进项目
需要指定api文件存放目录且按照文件path的方式作为mock接口路径
接口文件命名方式 
[请求方式]_{接口名称}.[文件扩展名]
[get|post|delete]_{name}.[json|ts|js]
内容为接口返回内容，ts|js 中可做一些更复杂的数据生成同时
ts|js 文件中,必须为 module.exports = {content}
不能返回函数
同名的文件，按照 json ts js 的顺序优先级取第一个,应当避免同名文件

举例
当有一个 get 接口为  /test/t
在项目中mockapi地址为   /[mockDir]/test/get_t.[json|ts|js]
mockDir 为相对于vite项目根目录的 mockApi 文件目录。



```

## 配置

```typescript
// vite.config.ts

import vitePluginMockjsServer from 'vite-plugin-mockjs-server'

export default defineConfig({
    plugins: [
        vitePluginMockjsServer({mockDir:"mock"})
    ]
});
```

## 选项说明

|  字段 | 类型  | 默认值  |       说明     |
|  ----| ---- | ---- | ----                             |
| mockDir | 字符串 | mock  |相对于vite项目根目录的 mockApi 文件目录 |

## 列子
```text
将mockapi目录配置为mock

-mock
--test
---get_a.json
---get_b.ts
---post_c.js

访问地址 get mock/test/a 
 post mock/test/b  
 post mock/test/c
```

```json
{
  "get_a.json": "内容"
}
```
```typescript
module.exports=[
    {
        "ts文件":"测试"
    }
]
```
```javascript
module.exports=[
    {
        "js文件":"测试"
    }
]
```
