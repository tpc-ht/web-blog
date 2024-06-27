---
title: css
group: style
---

# css 特定场景 代码片段

## 文本强制换行

```css
 {
  word-break: break-all;
}
```

## 设置小于 12px 的字体

1. `zoom` 非标属性，有兼容问题，缩放会改变了元素占据的空间大小，触发重排

```css
 {
  zoom: 0.5;
  zoom: 50%;
}
```

2. `transform:scale()` 大部分现代浏览器支持，并且对英文、数字、中文也能够生效，缩放不会改变了元素占据的空间大小，页面布局不会发生变化

```css
 {
  transform: scale(0.5);
  transform: scale(50%);
}
```

## 解决 div 拖动出现禁止图标

```js
<div onMouseDown={(e) => e?.preventDefault()} />
```

## 吸顶

```css
 {
  position: sticky;
  top: 0;
}
/*
    吸低
    bottom: 0;
*/
```

## 背景图片居中显示防变形

固定图片容器的宽高，移动背景图片居中。

```css
 {
  width: 200px;
  height: 120px;

  background-image: url(https://----.png);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
```

## 解决 Flex 布局下文本溢出省略号失效

省略号的显示是需要固定宽度的，而 flex 布局下子元素的宽度是随父元素宽度的变化而变化的，所以省略号是失效的。
设置宽度为 0，使宽度自适应，文本超出省略号显示。

```css
 {
  flex: 1;
  min-width: 0;
}
```

## 文本省略

1. 单行省略

```css
 {
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  white-space: nowrap;
}
```

2. 多行省略

```css
 {
  word-break: break-all;
  overflow: hidden;
  display: -webkit-box;
  /* 2 就是 两行省略，填 1 为 一行省略 */
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
```

```tsx
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token, css }) => ({
  text: { color: 'red' },
}));
export default () => {
  const { styles } = useStyles();
  return <div className={styles.text}>6</div>;
};
```
