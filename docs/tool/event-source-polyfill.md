---
title: event-source-polyfill
group: 基建
---

## 简介

HTTP 服务器推送也称 HTTP 流，是一种客户端-服务器通信模式，它将信息从 HTTP 服务器异步推送到客户端，而无需客户端请求。现在的 web 和 app 中，越来越多的场景使用这种通信模式，比如实时的消息提醒，IM 在线聊天，多人文档协作等。以前实现这种类似的功能一般都是用 ajax 长轮询，而现在我们有了新的、更优雅的选择 —— WebSocket 和 SSE。

- WebSocket 是 HTML5 开始提供的一种在单个 TCP 连接上进行全双工通讯的协议。
- SSE 是 Server-Sent Events 的简称， 是一种服务器端到客户端(浏览器)的单项消息推送。对应的浏览器端实现 Event Source 接口被制定为 HTML5 的一部分。不过现在 IE 不支持该技术。相比于 WebSocket，SSE 简单很多，服务器端和客户端工作量都要小很多、简单很多，同时实现的功能也要有局限。

SSE 与 WebSocket 有相似功能，都是用来建立浏览器与服务器之间的通信渠道。两者的区别在于：

- WebSocket 是全双工通道，可以双向通信，功能更强；SSE 是单向通道，只能服务器向浏览器端发送。
- WebSocket 是一个新的协议，需要服务器端支持；SSE 则是部署在 HTTP 协议之上的，现有的服务器软件都支持。
- SSE 是一个轻量级协议，相对简单；WebSocket 是一种较重的协议，相对复杂。
- SSE 默认支持断线重连，WebSocket 则需要额外部署。
- SSE 支持自定义发送的数据类型。
- SSE 不支持 CORS，参数 url 就是服务器网址，必须与当前网页的网址在同一个网域（domain），而且协议和端口都必须相同。WebSocket 支持

## 原生 EventSource 实现

详细请参考：[EventSource](https://developer.mozilla.org/zh-CN/docs/Web/API/EventSource/EventSource)

### 使用

```ts
const url = '/xx/xxx';
// 1. 创建实例
var source = new EventSource(url);

// 2. 事件监听
// 建立连接后，触发`open` 事件
source.addEventListener('open', (e) => {
  console.log('open', e);
});
// 收到消息，触发`message` 事件
source.addEventListener('message', (e) => {
  console.log('message', e);
});
// 发生错误，触发`error` 事件
source.addEventListener('error', (e) => {
  console.log('error', e);
});

// 3. 关闭链接
source.close();
```

## event-source-polyfill 实现

由于，我请求该接口，需要带上 `token`，所以直接使用 `EventSource` 不行，另外这个 IE 也不支持。所以选择了一个工具：[event-source-polyfill](https://github.com/Yaffle/EventSource)。

### 安装

```bash
yarn add event-source-polyfill
```

### 使用

```ts
import { EventSourcePolyfill } from "event-source-polyfill";
createSource() {
  const url = '/xx/xx/xx'
  const source = new EventSourcePolyfill(url, {
    headers: {
      token: 'xxxxx'
    }
  })
  source.addEventListener('open', (e) => {
    console.log('open', e)
  })
  source.addEventListener('message', (e) => {
    console.log('message', e)
  })
   source.addEventListener('error', (e) => {
    console.log('error', e)
  })
}
```

## 注意事项

本地开发时如果配置了代理，会一直收不到后端发送的消息，尝试加入以下参数：

```ts
// vue.config.js

module.exports = {
  // ...
  devServer: {
    compress: false,
    ....
  }
}
```

如果还是收不到消息，可以尝试关闭代理，或者发布到测试环境调试
