import { defineConfig } from 'dumi';


export default defineConfig({
  themeConfig: {
    name: 'TcBlog',
    footer: 'TC前端知识库',
    footerConfig: {
      copyright: new Date().getFullYear(),
      columns: []
    },
    // syntaxTheme: {
    //   // shiki 的主题可以直接配置字符串
    //   shiki: {
    //     dark: 'dark-plus',
    //     light: 'github-light',
    //   },
    //   // prism 的主题配置需要引入对象
    //   // prism: {
    //   //   dark: vscDarkPlus,
    //   //   light: vs,
    //   // },
    // },
  },
});
