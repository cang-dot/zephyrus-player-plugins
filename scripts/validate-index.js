/**
 * index.json 格式校验脚本
 * 用法: node scripts/validate-index.js
 */

const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.json');
const SUPPORTED_TYPES = ['lxMusic', 'customApi', 'theme', 'playerStyle', 'translator'];
const REQUIRED_FIELDS = ['id', 'name', 'description', 'version', 'type', 'author', 'downloadUrl'];

const errors = [];
const warnings = [];

function check(condition, message, isError = true) {
  if (!condition) {
    if (isError) errors.push(message);
    else warnings.push(message);
  }
}

// 读取 index.json
let data;
try {
  data = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
} catch (e) {
  console.error('无法解析 index.json:', e.message);
  process.exit(1);
}

// 校验顶层字段
check(data.schemaVersion === 1, 'schemaVersion 必须为 1');
check(typeof data.updatedAt === 'string', 'updatedAt 必须为字符串');
check(Array.isArray(data.plugins), 'plugins 必须为数组');

// 校验每个插件条目
const seenIds = new Set();
data.plugins.forEach((plugin, i) => {
  const prefix = `plugins[${i}] (${plugin.name || 'unnamed'})`;

  // 必填字段
  REQUIRED_FIELDS.forEach((field) => {
    check(
      plugin[field] !== undefined && plugin[field] !== '',
      `${prefix}.${field} 为必填字段`
    );
  });

  // id 唯一性
  if (plugin.id) {
    check(!seenIds.has(plugin.id), `${prefix}.id "${plugin.id}" 重复`);
    seenIds.add(plugin.id);
    check(/^[a-z0-9][a-z0-9_-]*$/.test(plugin.id),
      `${prefix}.id "${plugin.id}" 格式不合法（只能包含小写字母、数字、-、_）`);
  }

  // type
  if (plugin.type) {
    check(
      SUPPORTED_TYPES.includes(plugin.type),
      `${prefix}.type "${plugin.type}" 不是支持的插件类型（${SUPPORTED_TYPES.join(', ')}）`
    );
  }

  // version 格式
  if (plugin.version) {
    check(
      /^\d+\.\d+\.\d+$/.test(plugin.version),
      `${prefix}.version "${plugin.version}" 不是合法 SemVer 格式`
    );
  }

  // downloadUrl 格式
  if (plugin.downloadUrl) {
    check(
      plugin.downloadUrl.startsWith('https://'),
      `${prefix}.downloadUrl 必须是 HTTPS URL`
    );
  }

  // sourceRepo 格式
  if (plugin.sourceRepo) {
    check(
      plugin.sourceRepo.startsWith('https://'),
      `${prefix}.sourceRepo 必须是 HTTPS URL`
    );
  }

  // optional 字段类型
  if (plugin.tags !== undefined) {
    check(Array.isArray(plugin.tags), `${prefix}.tags 必须为数组`);
  }
  if (plugin.screenshots !== undefined) {
    check(Array.isArray(plugin.screenshots), `${prefix}.screenshots 必须为数组`);
  }
});

// 输出结果
if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ index.json 校验通过');
  process.exit(0);
}

if (errors.length > 0) {
  console.error('❌ 校验失败：');
  errors.forEach((e) => console.error(`  - ${e}`));
}

if (warnings.length > 0) {
  console.warn('⚠️  警告：');
  warnings.forEach((w) => console.warn(`  - ${w}`));
}

if (errors.length > 0) {
  process.exit(1);
}
