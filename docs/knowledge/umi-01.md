---
title: umi 请求/响应拦截器、异常处理的封装
group: umi
---

# umi 请求/响应拦截器、异常处理的封装

## 登录过期跳转

```ts
// utils/config
import { stringify } from 'qs';
import { history } from '@umijs/max';
export const loginPath = `/user/login`;
export const backToLogin = () => {
  // 情空本地存储
  clearAuthority();
  if (window.location.pathname !== loginPath) {
    message.error('登录失效，请重新登录！');
    const search =
      window.location.pathname === '/'
        ? {}
        : {
            search: stringify({
              redirect: window.location.pathname,
            }),
          };
    history.push({
      pathname: loginPath,
      ...search,
    });
  }
};
```

## 请求中断相关配置

```ts
// utils/request
import axios from 'axios';
type RequestInterruptPropsType = {
  avoidUrls: string[];
};
type WindowType = typeof window & {
  cancelRequest: Map<
    any,
    {
      pathname: string;
      cancel: any;
      url: string;
    }
  >;
};
const { CancelToken } = axios;
class requestInterrupt {
  avoidUrls;
  constructor(props: RequestInterruptPropsType) {
    this.avoidUrls = props.avoidUrls;
    if (
      Object.prototype.toString.call((window as WindowType).cancelRequest) !==
      '[object Map]'
    ) {
      (window as WindowType).cancelRequest = new Map();
    }
  }
  requestInit(options: any) {
    return this.avoidUrls.indexOf(options.url) === -1
      ? new CancelToken((cancel) => {
          (window as WindowType).cancelRequest.set(Symbol(Date.now()), {
            pathname: window.location.pathname,
            cancel,
            url: options.url,
          });
        })
      : undefined;
  }
  requestCancel(cancelCallback?: (value: any, key: string) => boolean) {
    const { cancelRequest } = window as WindowType;
    cancelRequest?.forEach((value: any, key: string) => {
      const bool = cancelCallback ? cancelCallback(value, key) : true;
      if (bool) {
        value?.cancel?.();
        cancelRequest.delete(key);
      }
    });
  }
}

export const reqInterrupt = new requestInterrupt({
  // 设置白名单
  avoidUrls: ['/sms/remind', '/logined'],
});
```

## 完整实现

```ts
import type { RequestConfig } from '@umijs/max';
import { message } from 'antd';
import { RequestOptions } from './.umi/plugin-request/request';
import { GetLocalStorage } from './utils';
import { backToLogin, loginPath } from './utils/config';
import { reqInterrupt } from './utils/request';

const codeMessage: Record<number, string> = {
  200: '服务器成功返回请求的数据。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  410: '请求的资源被永久删除，且不会再得到的。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  // 超时时间
  timeout: 200000,
  baseURL: `${process.env.APP_PUBLIC_PATH}api`,
  // 请求拦截器
  requestInterceptors: [
    (url: string, options: RequestOptions) => {
      // 配置请求中断
      const cancelToken = reqInterrupt.requestInit(options);
      // 在 localStorage 获取 token
      const token = getLocalStorage('token');
      if (!token && window.location.pathname !== loginPath) {
        throw { response: { status: 401, msg: '登录已过期！' } };
      }
      return {
        url: url,
        options: {
          ...options,
          cancelToken,
          headers: {
            ...options.headers,
            token,
          },
        },
      };
    },
  ],
  // 响应拦截器
  responseInterceptors: [
    (response: any) => {
      if (response.status !== 200) return Promise.reject(response);
      let { data, headers, config } = response;
      if (data.code === 401) {
        backToLogin();
        return Promise.reject(response);
      }
      // 跳过错误处理
      if (!!response?.config?.skipErrorHandler) return response;
      // 导出文件返回的blob类型， 特殊处理
      if (config.responseType == 'blob') {
        if (data.size == 0 || headers['content-type']?.includes('json')) {
          let fileReader = new FileReader();
          fileReader.readAsText(data);
          fileReader.onload = function (result) {
            let errorText = '未知错误，请稍后再试！';
            try {
              let { msg, code } = JSON.parse((result.target as any).result);
              errorText = msg ? msg : codeMessage[code] || errorText;
            } catch (e) {}
            message.error(errorText);
          };
          return Promise.reject(response);
        }
        return response;
      }
      return data.code === 200 ? response : Promise.reject(response);
    },
  ],
  errorConfig: {
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      const { response, config, data, name } = error;
      if (name === 'CanceledError') return;
      if (name === 'AxiosError') {
        const { status, statusText } = response;
        const errorText =
          codeMessage[status] || `请求服务器错误：${statusText}`;
        //   是否提示
        !config?.skipTipHandler && message.error(errorText);
      } else {
        !config?.skipTipHandler && data?.msg && message.error(data?.msg);
      }
    },
  },
};
```

## 入口文件集成

```ts
// app.tsx
export const request: RequestConfig = {
  ...errorConfig,
};
```

## 请求接口中断使用

```ts
import { reqInterrupt } from './utils/request';
/**路由发生改变*/
export function onRouteChange({ clientRoutes, location: { pathname } }: any) {
  // ----
  /*终止请求*/
  reqInterrupt.requestCancel((value: any) => value.pathname !== pathname);
  // ---
}
```

## 请求函数使用

接口返回 `100` 时

```ts
// 接口封装
function testResCode100() {
  return request<BaseApiType>('/companies', {
    method: 'POST',
    // 是否取消提示
    // skipTipHandler: true,
    // 是否取消错误处理
    // skipErrorHandler: true,
  });
}
// 使用
try {
  await testResCode100();
  console.log('不会执行');
} catch (error) {
  console.log('执行了报错');
}
```

umi 版本为 4.x
