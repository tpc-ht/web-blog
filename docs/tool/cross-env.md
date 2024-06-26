---
title: cross-env
group: 基建
---

# 简介

cross-env 是一个用于设置环境变量的跨平台命令行工具，它允许开发者在不同的操作系统中以统一的方式配置和使用环境变量

# 安装

```bash
# 将 cross-env 安装到开发环境
yarn add cross-env --dev
```

运行时修改环境变量

```json
    "scripts": {
        "start": "max dev",
        "start:dev": "cross-env REACT_APP_ENV=dev max dev",
        "start:test": "cross-env REACT_APP_ENV=test max dev",
    }
```
