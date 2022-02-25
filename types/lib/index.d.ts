import { Plugin } from "vite";
/**
 * 模拟mock 接口 插件
 * @param mockDir 默认值 "mock" ;    mockApi 目录，相对于vite项目 根目录,同时也是,mockapi  前缀
 */
export default function ({ mockDir }?: {
    mockDir?: string | undefined;
}): Plugin;
