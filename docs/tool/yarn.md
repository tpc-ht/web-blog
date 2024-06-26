---
title: yarn
group: 基建
---

# 简介

Yarn 是一个快速、可靠、安全的依赖管理工具。是 Facebook、Google、Exponent 和 Tilde 联合推出了一个包管理工具。

# 安装

```bash
npm install -g yarn
```

## 初始化

```bash
yarn init
```

## 添加依赖包

```bash
# 安装一个新的依赖包并将其添加到 package.json 文件中。
yarn add [package]
# 如果需要安装特定版本的依赖包，可以在包名后加上@符号和版本号。
yarn add [package]@[version]
# 将依赖项添加到 devDependencies 中，这些依赖仅在开发环境中使用。
yarn add [package] --dev
# 将依赖项添加到 peerDependencies 中，这通常用于插件或扩展包。
yarn add [package] --peer
# 将依赖项添加到 optionalDependencies 中，这些依赖在缺失时不会影响项目的主要功能。
yarn add [package] --optional
```

## 升级依赖包

```bash | prism
# 用于升级项目中的依赖包到最新版本。如果你想要升级所有依赖包，可以不指定包名直接运行此命令。
yarn upgrade [package]
# 将指定的包升级到某个特定版本号。
yarn upgrade [package]@[version]
# 你也可以使用特定的标签（如 latest 或 beta）来升级到相应的版本。
yarn upgrade [package]@[tag]
```

## 删除依赖包

```bash
# 从项目中删除不再需要的依赖包
yarn remove [package]
```

## 检查更新

```bash
# 检查项目中的依赖包是否有可用的更新版本。。
yarn outdated
```

## 查看与设置配置信息

```bash
# 查看配置信息
yarn config list
# 设置配置信息
yarn config set [key] [value]
# 例如 设置镜像地址
yarn config set registry https://registry.npm.taobao.org
```

## 设置代理

```bash
# 设置代理
yarn config set proxy http://127.0.0.1:1080
# 取消代理
yarn config delete proxy
```

## 设置镜像地址

```bash
`
// 例如 修改为淘宝镜像
yarn config set registry https://registry.npmmirror.com
```

## 其他常用命令

```bash
# 启动项目，通常用于开发环境，这个命令会运行 package.json 文件中定义的 start 脚本。
yarn start
# 构建项目，用于生产环境，执行的是 package.json 中的 build 脚本。
yarn build
# 运行项目的测试，执行的是 package.json 中的 test 脚本，确保项目的功能和稳定性。
yarn test
```
