# Zephyrus Player Plugins

[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

Zephyrus Player 的官方插件注册表与社区插件仓库。

## 快速开始

### 浏览插件

在 Zephyrus Player 设置 → 插件商店 中浏览和安装所有已收录的插件。

### 提交你的插件

1. 确保你的插件遵循 [PLUGIN_SPEC.md](PLUGIN_SPEC.md) 规范
2. 在你的 GitHub 仓库创建 Release 或提供稳定的 Raw URL
3. 提交 [Issue](https://github.com/cang-dot/zephyrus-player-plugins/issues/new?template=plugin-submission.md)
4. 审核通过后合入 `index.json`

详细流程见 [CONTRIBUTING.md](CONTRIBUTING.md)。

### 本地开发

详见 [PLUGIN_SPEC.md](PLUGIN_SPEC.md#本地开发) 的开发指南。

## 目录结构

```
├── index.json              # 插件官方目录（应用端 fetch 的主文件）
├── PLUGIN_SPEC.md          # 插件规范
├── CONTRIBUTING.md         # 贡献指南
├── REVIEW_CHECKLIST.md     # 审核检查清单
├── community/              # 小型插件的直接存档目录
└── scripts/
    └── validate-index.js   # index.json 校验脚本
```

## 插件类型

| 类型 | 说明 | 运行环境 |
|---|---|---|
| `lxMusic` | 落雪音源脚本 | Web Worker 沙盒 |
| `customApi` | 自定义音乐 API 配置 | 渲染进程 |
| `theme` | 主题外观（CSS 变量） | 渲染进程注入 |
| `playerStyle` | 全屏播放器样式 | 渲染进程（DOM API） |
| `translator` | 歌词翻译引擎 | Web Worker 沙盒 |

## License

MIT
