# Zephyrus Player 插件规范

## 插件生命周期

```
开发 → 发布 Release / 提供 Raw URL → 提交 Issue → 审核 → 合入 index.json → 用户端可见
```

## 插件类型

### `lxMusic` — 落雪音源脚本

提供音乐 URL 解析能力，在 Web Worker 沙盒中执行。

**规范**：
- 单 `.js` 文件
- 使用 `globalThis.lx` API 注册音源
- 必须调用 `lx.send('inited', data)` 完成初始化
- 必须处理 `lx.on('request', handler)` 请求

**`manifest.json`** 示例：
```json
{
  "name": "6音源合集",
  "version": "2.1.0",
  "type": "lxMusic",
  "entry": "script.js"
}
```

**入口 `script.js`** 结构：
```javascript
// ==UserScript==
// @name         6音源合集
// @version      2.1.0
// @author       author
// @description  支持酷我/酷狗/QQ音乐/网易云/咪咕/local
// @homepage     https://github.com/author/repo
// ==/UserScript==

// 遵循落雪音乐自定义源规范
```

---

### `customApi` — 自定义音乐 API 配置

提供自定义的音乐解析 API 端点配置。

**规范**：
- 单 `.json` 文件
- 必须包含 `name`、`apiUrl` 字段

**`config.json`** 示例：
```json
{
  "name": "我的自定义API",
  "apiUrl": "https://my-api.example.com",
  "description": "自定义音乐解析服务"
}
```

---

### `theme` — 主题外观

覆盖 Zephyrus Player 的 CSS 变量以改变应用外观。

**规范**：
- 单 `.css` 文件或包含 `manifest.json` 的目录
- 必须通过 `:root` 选择器定义 CSS 变量
- 支持变量列表见下方

**`theme.css`** 示例：
```css
:root {
  --accent-color: #9b59b6;
  --bg-primary: #1a1a2e;
  --bg-secondary: #16213e;
  --text-primary: #e8e8e8;
  --text-secondary: #a0a0a0;
  --border-color: rgba(255, 255, 255, 0.08);
  --hover-bg: rgba(255, 255, 255, 0.05);
}
```

**可用 CSS 变量表**：

| 变量名 | 用途 | 默认值 |
|---|---|---|
| `--accent-color` | 强调色 | `#10b981` |
| `--bg-primary` | 主背景色 | 跟随主题 |
| `--bg-secondary` | 二级背景 | 跟随主题 |
| `--text-primary` | 主文字色 | 跟随主题 |
| `--text-secondary` | 次要文字色 | 跟随主题 |
| `--border-color` | 边框色 | 跟随主题 |
| `--hover-bg` | 悬停背景 | 跟随主题 |

---

### `playerStyle` — 全屏播放器样式

自定义全屏播放器的视觉布局和交互。支持两种模式：

| 模式 | 适用场景 | 技术栈 | 版本 |
|---|---|---|---|
| **DOM API** | 轻量、高性能、Canvas/WebGL 渲染 | 原生 DOM API | v1 |
| **Vue Component** | 复用 Vue 生态、复杂交互、Naive UI 组件 | Vue 3 SFC | v1.1+ |

---

#### 模式 A：DOM API（v1）

**规范**：
- 包含 `manifest.json` + `main.js` 的目录
- 打包为 `.zip` 文件

**`manifest.json`**：
```json
{
  "name": "黑胶唱片播放器",
  "version": "1.0.0",
  "type": "playerStyle",
  "entry": "main.js",
  "style": "style.css",
  "settings": [
    { "key": "showCover", "type": "boolean", "label": "显示封面", "default": true },
    { "key": "coverSize", "type": "slider", "label": "封面大小", "min": 100, "max": 400, "step": 10, "default": 280 }
  ]
}
```

**`main.js`** 导出接口：
```javascript
export default {
  /**
   * 挂载时调用
   * @param {HTMLElement} container - 渲染容器
   * @param {StyleContext} ctx - 样式上下文
   * @returns {Function|void} - 可选的清理函数
   */
  mount(container, ctx) {
    container.innerHTML = `...`
    return () => { container.innerHTML = '' }
  },

  /**
   * 更新时调用（播放进度、歌词变化时触发）
   * @param {HTMLElement} container
   * @param {StyleContext} ctx
   */
  update(container, ctx) {
    // 增量更新
  }
}
```

**`style.css`** — 自动 scope 到容器内：
```css
.vp-root { position: relative; height: 100%; }
```

---

#### 模式 B：Vue Component（v1.1+）

插件作者以 Vue SFC 开发播放器界面，构建后发布为单 `.js` 文件。

**规范**：
- 单 `.js` 文件（构建产物，非原始 `.vue`）
- 导出 Vue 组件选项对象（Options API 或 `defineComponent` 的结果）
- 运行时不编译，无额外体积开销

**开发方式**（推荐 Vite + `@vitejs/plugin-vue`）：
```vue
<!-- Player.vue -->
<template>
  <div class="my-player">
    <img :src="ctx.coverUrl" class="cover" />
    <h2>{{ ctx.songName }}</h2>
    <p>{{ ctx.artist }}</p>
    <button @click="ctx.togglePlay">
      {{ ctx.isPlaying ? '⏸' : '▶' }}
    </button>
    <div class="progress-bar" @click="seek">
      <div class="progress-fill" :style="{ width: ctx.progressPercent + '%' }" />
    </div>
  </div>
</template>

<script setup>
defineProps({ ctx: { type: Object, required: true } })
const emit = defineEmits(['settingsChange'])
const seek = (e) => ctx.seekTo(e.offsetX / e.currentTarget.offsetWidth * ctx.duration)
</script>

<style scoped>
.my-player { /* ... */ }
</style>
```

**构建为单文件（`vite.config.js`）**：
```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: { entry: 'src/Player.vue', formats: ['es'], fileName: () => 'main.js' },
    rollupOptions: { external: ['vue'] }
  }
})
```

**构建产物 `main.js`** 被 Zephyrus 加载，注册为：
```javascript
import { defineComponent } from 'vue' // 构建时内联，无需运行时 import

export default defineComponent({
  name: 'MyPlayer',
  props: { ctx: Object, settings: Object },
  emits: ['settingsChange'],
  template: `...`,            // 已编译为 render 函数
  setup(props) { /* ... */ }  // 已编译，无额外开销
})
```

**`manifest.json`**：
```json
{
  "name": "极简播放器",
  "version": "1.1.0",
  "type": "playerStyle",
  "entry": "main.js",
  "renderMode": "vue",
  "settings": [
    { "key": "showCover", "type": "boolean", "label": "显示封面", "default": true }
  ]
}
```

关键区别：`"renderMode": "vue"` 标记为 Vue 组件模式。

---

#### 两种模式的共同部分

**`StyleContext` 可用属性**（两种模式均可通过 props / ctx 参数访问）：
```typescript
interface StyleContext {
  coverUrl: string
  songName: string
  artist: string
  album: string
  duration: number
  currentTime: number
  progressPercent: number
  isPlaying: boolean
  lyricLines: LyricLine[]
  currentLyricLine: string
  isClimax: boolean
  energy: number
  coverColor: string
  accentColor: string
  togglePlay: () => void
  seekTo: (time: number) => void
  nextTrack: () => void
  prevTrack: () => void
}
```

**`settings` 配置项格式**（两种模式通用）：
```typescript
interface SettingItem {
  key: string
  type: 'boolean' | 'radio' | 'color' | 'slider' | 'font'
  label: string
  default: any
  options?: { value: string; label: string }[]
  min?: number; max?: number; step?: number
  showWhen?: { key: string; value: any }
}
```

设置面板由 Zephyrus Player 自动渲染，插件通过 `settingsChange` 事件（Vue 模式）或 `ctx.onSettingsChange` 回调（DOM 模式）接收变更。

---

### `translator` — 歌词翻译引擎

将歌词文本翻译为目标语言。

**规范**：
- 单 `.js` 文件
- 导出一个 `translate` 函数

**`translate.js`**：
```javascript
/**
 * 翻译歌词
 * @param {string} text - 原文
 * @param {string} from - 源语言代码
 * @param {string} to - 目标语言代码
 * @returns {Promise<string>} 翻译结果
 */
export async function translate(text, from, to) {
  // 调用翻译 API
  const response = await fetch(`https://api.example.com/translate`, {
    method: 'POST',
    body: JSON.stringify({ text, from, to })
  })
  const data = await response.json()
  return data.translatedText
}
```

---

## 通用规范

### 版本号

遵循 [SemVer](https://semver.org/)：`主版本.次版本.修订号`

### `manifest.json` 通用字段

| 字段 | 必填 | 说明 |
|---|---|---|
| `name` | ✅ | 插件名称 |
| `version` | ✅ | 当前版本号 |
| `type` | ✅ | 插件类型（见上方） |
| `entry` | ✅ | 入口文件名 |
| `author` | ✅ | 作者名或 GitHub ID |
| `description` | ✅ | 一句话描述 |
| `icon` | ❌ | 图标 URL（建议 128x128） |
| `homepage` | ❌ | 项目主页 |
| `license` | ❌ | 许可证 |
| `minAppVersion` | ❌ | 兼容的最低 Zephyrus 版本 |
| `tags` | ❌ | 标签数组 |
| `screenshots` | ❌ | 截图 URL 数组 |

### 最小兼容版本

如果插件用到特定版本的 API，需在 `minAppVersion` 字段标注。未标注则视为兼容所有版本。

### 安全性要求

- 禁止使用 `eval()` / `new Function()` 执行任意代码（lxMusic 类型在 Worker 沙盒中除外）
- 禁止收集用户隐私数据
- 禁止向第三方发送用户音乐偏好/播放历史
- 涉及网络请求的需通过应用提供的 API 进行

### 打包要求

- **单文件插件**（lxMusic / customApi / theme / translator）：直接提供 Raw URL 或 Release 附件
- **多文件插件**（playerStyle）：打包为 `.zip`，保持目录结构
