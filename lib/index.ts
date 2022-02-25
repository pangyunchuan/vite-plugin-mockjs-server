const Mock = require('mockjs')
import {Plugin, ResolvedConfig} from "vite";

const url = require('url')
const fs = require('fs')
const path = require('path')

/**
 * 模拟mock 接口 插件
 * @param mockDir 默认值 "mock" ;    mockApi 目录，相对于vite项目 根目录,同时也是,mockapi  前缀
 */
export default function (
    {mockDir = "mock"} = {}, // mockApi 目录，相对于vite项目 根目录
): Plugin {
    let viteConfig: ResolvedConfig;
    return <Plugin>{
        name: "vite-plugin-mockjs-server",
        apply: "serve",
        configResolved(resolvedConfig) {
            // 存储最终解析的配置
            viteConfig = resolvedConfig;
        },
        configureServer(server) {
            const mockApiRootUrl = `/${mockDir}`
            if (!fs.existsSync(path.resolve(viteConfig.root, mockDir))) {
                throw Error(`vite-plugin-mockjs-server: ${mockDir} 目录不存在`);
            }
            //前置中间件
            server.middlewares.use((req, res, next) => {
                //获取url path
                let pathname = <string>url.parse(<string>req.url, true).pathname;

                //检查是否访问模拟api
                if (!pathname.includes(mockApiRootUrl)) {
                    return next();
                }

                //获取请求方法并转为小写
                let method = <string>req.method;
                method = method.toLowerCase();

                //根据请求路径，获取文件相对路径
                let pathArr = pathname.split("/");
                let lastName = <string>pathArr.pop();
                let fileName =
                    method + "_" + lastName;

                //发送响应数据
                function sendRes(fileData: {}) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify(fileData));
                    //  原始node request 用了 end 就不能 next()了
                }

                //查找文件
                function findFileSend(ext: string) {
                    //json文件
                    let file = fileName + `.${ext}`;
                    let truePath = path.join(
                        viteConfig.root,
                        [...pathArr, file].join("/")
                    );
                    if (fs.existsSync(truePath)) {
                        //清除 require 缓存
                        delete require.cache[truePath];
                        sendRes(Mock.mock(require(truePath)));
                        return true;
                    }
                    return false;
                }

                for (let ext of ["json", "ts", "js"]) {
                    if (findFileSend(ext)) {
                        return;
                    }
                }
                next();
            });
        }
    };
};
