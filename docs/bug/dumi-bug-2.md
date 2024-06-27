---
title: antd 全局样式引入
group: dumi
---

# antd 全局样式引入

配置文件中添加

```javascript
// .dumirc.ts
import { defineConfig } from 'dumi';
export default defineConfig({
  // ...
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
      'antd',
    ],
  ],
  // ...
});
```
