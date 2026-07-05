# 贡献指南

感谢你愿意为 Zephyrus Player 社区贡献插件！

## 提交流程

```
1. 开发插件 → 2. 发布 Release → 3. 提 Issue → 4. 审核 → 5. 合入 index.json
```

### Step 1: 开发插件

确保你的插件遵循 [PLUGIN_SPEC.md](PLUGIN_SPEC.md) 中的规范，并在本地 Zephyrus Player 中测试通过。

### Step 2: 发布 Release

将你的插件上传到**你自己的 GitHub 仓库**的 Release 中，或提供稳定的 Raw URL。

单文件插件（lxMusic / customApi / theme CSS / translator）：
- 创建一个 GitHub Release，将文件作为附件上传
- 或直接推送文件到仓库，使用 `raw.githubusercontent.com` 链接

多文件插件（playerStyle）：
- 打包为 `.zip`，上传到 Release

> 小贴士：如果你不想维护独立仓库，可以将插件文件直接 PR 到本仓库的 `community/` 目录。审核通过后我们会保留在此仓库内。

### Step 3: 提交 Issue

点击 [New Issue](https://github.com/cang-dot/zephyrus-player-plugins/issues/new?template=plugin-submission.md) 并使用插件提交模板。

需要填写的信息：
- 插件名称、描述、类型、版本号
- 作者 GitHub ID
- 源码仓库地址
- 下载 URL（Release 附件或 Raw URL）
- 图标 URL（建议 128x128 PNG）
- 截图 URL（可选，最多 3 张）

### Step 4: 审核

维护者会检查：
- 安全性：无恶意代码、无数据收集
- 质量：代码清晰、符合规范
- 功能：在最新版本 Zephyrus Player 上测试通过
- 唯一性：不与现有插件重复

审核周期通常为 **3-7 个工作日**。

### Step 5: 合入

审核通过后，维护者会在 `index.json` 中添加你的插件条目并合入主分支。

之后用户在 Zephyrus Player 中刷新插件商店即可看到你的插件。

## 提交注意事项

- 每个插件单独提交一个 Issue
- 更新插件版本时，在 Issue 中补充说明变更内容
- 如果你的插件仓库地址变更，请及时在 Issue 中更新
- 插件名称请保持简洁且唯一

## 插件更新流程

1. 在你的仓库发布新 Release
2. 在已有 Issue 中评论更新版本号和下载 URL
3. 审核后更新 `index.json`
