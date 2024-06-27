---
title: vscode报错：找不到 .d.ts 中定义的类型变量
group: typeScript
---

# vscode 报错：找不到 .d.ts 中定义的类型变量

假如你在写 ts 的类型时报错：`找不到名称 xxx`，并且你已经在`types`或者`typings`目录中定义好了。那你应该检查你的`tsconfig.json`的`include`字段。

```json
{
  "include": ["src/**/*.ts", "src/**/*.d.ts", "types/**/*.d.ts"]
}
```
