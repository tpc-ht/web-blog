---
title: ts 全局类型定义
group: typeScript
---

# 全局类型定义

`declare` 用来全局声明变量、常量、类、全局对象等等

`namespace` 命名空间

也可以将 `namespace API` 抽离出来，但全局不能定义 `declare global` 会导致 `namespace` 失效，反之都存放在 `global` 中

```ts
declare global {
  // API.ParamsType 直接使用
  namespace API {
    type ParamsType = {};
  }
  type BaseApiType<T = any> = {
    data: T;
    code: number;
    msg: string;
  };
}
```

使用

```ts
export async function getList(data: API.ParamsType) {
  return request<BaseApiType>('/park/bind/list', {
    method: 'POST',
    data,
  });
}
```
