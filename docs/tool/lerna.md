---
title: lerna
group: 基建
---

# lerna

## 简介

Lerna 是一种高效的项目管理工具，专门用于优化托管在 git 和 npm 上的多 package 代码库的工作流。

它被设计为快速且现代的构建系统，帮助开发者在单一存储库中管理多个 JavaScript/TypeScript 包。这个工具不仅提高了维护多包项目的便利性，还优化了整个开发流程的效率.

## 安装

```bash
yarn global add lerna
npm install -g lerna
```

## 创建子应用

```bash
lerna create <name> [loc(指定目录)]
```

## 链接子包与子包之间的依赖(本地)

```bash
lerna link
```

## 依赖初始化

```bash
lerna bootstrap
```

## 安装依赖

```bash
lerna add lodash
```

### 指定包安装依赖

```bash
lerna add lodash --scope=@xxxx/utils
```

## 更新公共依赖

- 需要借助 [lerna-update-wizard](https://github.com/Anifacted/lerna-update-wizard)

### 安装 lerna-update-wizard

```bash
yarn add --dev lerna-update-wizard
yarn global add lerna-update-wizard
```

### 启动 lerna-update-wizard

```bash
npx lerna-update-wizard
```

## 运行

```bash
lerna run
```

## 版本发布

```bash
lerna publish
```

## 查看包的本地修改

```bash
lerna diff
```

## 清空子项目 `node_modules`

```bash
lerna clean
```

## 发布流程

`lerna`必须先与 git 链接。发布时会去判断 git 和 npm 的区别进行比较。(也就是先传代码到 git 仓库，在发布)

### 步骤如下：

- 使用 lerna 创建项目
- 创建 git
- 创建 npm 组
- 在创建 lerna 的子应用（这里会自动生成对应的 git 地址）
- <font color=red>子应用创建默认为私有的，需要给每个子应用的 package.json 设置，（私有收费的）</font>

```json
"publishConfig": {
  "access": "public",
  "registry": "https://registry.npmjs.org/"
}
```

- 发布

```bash
lerna publish
```

## 异常

`Working tree has uncommitted changes, please commit or remove the following changes before continuing`
直接方案：删除 `.git`，在生成一个对应库的 `.git`
