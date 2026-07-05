# 审核检查清单

维护者审核插件时逐项检查。

## 基础信息

- [ ] Issue 模板填写完整
- [ ] 名称不与其他插件重复
- [ ] 版本号遵循 SemVer
- [ ] 插件类型定义正确
- [ ] `minAppVersion`（如有）与实际兼容版本一致

## 安全检查

- [ ] 无 `eval()`、`new Function()` 执行不可信代码
- [ ] 无未声明的网络请求（lxMusic 类型除外）
- [ ] 无用户数据收集或外发
- [ ] 无文件系统访问（通过应用 API 的除外）
- [ ] 无加密矿工、广告注入等恶意行为

## lxMusic 类型

- [ ] 使用 `globalThis.lx` API（非原始 `fetch`/`XMLHttpRequest`）
- [ ] 调用 `lx.send('inited', data)` 完成初始化
- [ ] 注册了 `lx.on('request', handler)` 处理器
- [ ] 脚本头部包含 `@name`、`@version`、`@author` 元信息

## customApi 类型

- [ ] JSON 包含 `name` 和 `apiUrl` 字段
- [ ] `apiUrl` 指向合法的 API 端点（非内网地址）

## theme 类型

- [ ] 使用 `:root` 选择器
- [ ] 定义的 CSS 变量均为可用的公开变量
- [ ] 未使用 `!important` 覆盖关键 UI（特殊情况需备注）

## playerStyle 类型

- [ ] `manifest.json` 包含 `entry`、`style` 字段
- [ ] `main.js` 导出 `mount(container, ctx)` 函数
- [ ] 调用了 `container.innerHTML` 或 DOM 操作
- [ ] 返回了清理函数（卸载时恢复容器状态）
- [ ] `style.css` 使用 scoped 选择器

## translator 类型

- [ ] 导出 `async translate(text, from, to)` 函数
- [ ] 返回 `Promise<string>` 类型
- [ ] 有合理的超时处理

## 功能测试

- [ ] 在最新版本 Zephyrus Player 上测试通过
- [ ] 安装后即时生效（无需重启）
- [ ] 卸载后无残留
- [ ] 启用/禁用切换正常工作
