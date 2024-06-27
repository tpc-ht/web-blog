---
title: docs 中访问 packages 下的子包报 Module not found
group: dumi
---

# docs 中访问 packages 下的子包报 Module not found

配置项目别名

```javascript
// .dumirc.ts
import { defineConfig } from 'dumi';
import path from 'path';

export default defineConfig({
  // ...
  alias: {
    '@***/components': path.join(__dirname, 'packages/***/src'),
    '@***/utils': path.join(__dirname, 'packages/***/src'),
  },
  // ...
});
```
