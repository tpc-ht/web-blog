---
title: father build 打包后antd样式丢失
group: dumi
---

# father build 打包后 antd 样式丢失

配置文件中添加

```javascript
// .fatherrc.ts
import { defineConfig } from 'father';

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
    ],
  ],
  // ...
});
```
