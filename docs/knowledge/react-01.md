---
title: react 集成 tinymce@5.9 富文本编辑器
group: react
---

# umi+react 集成 tinymce@5.9 富文本编辑器（本地依赖化）

## 安装

安装 [tinymce](https://www.tiny.cloud/docs/tinymce/5/quick-start/) 的 `react` 依赖包

```bash
yarn add @tinymce/tinymce-react@3.12.0
```

## 本地依赖化

打开 `node_modules` 目录找到`tinymce` 并复制到 `public` 下

## 代码实现

```ts
import { Disabled, Loading } from '@tc-lib/components';
import { Editor } from '@tinymce/tinymce-react';
import './index.less';

import { PathModal, Upload } from '@/components';
import { isArr } from '@tc-lib/utils';
import { Button } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useActivate, useUnactivate } from 'react-activation';
import { DomToStr, NodeChange, getNode } from './util';

const plugins =
  'preview customLink importcss axwordlimit searchreplace powerpaste autolink quickbars directionality visualblocks visualchars fullscreen customImage image charmap hr pagebreak nonbreaking insertdatetime advlist lists  imagetools textpattern emoticons autosave autoresize formatpainter';

const toolbar = [
  'undo redo formatselect fontsizeselect bold italic underline strikethrough subscript superscript hr customLink customImage forecolor backcolor alignleft aligncenter alignright alignjustify outdent indent removeformat rotateleft',
];
const fontsize_formats =
  '12px 14px 16px 18px 20px 22px 24px 26px 28px 30px 34px 36px 40px 48px 60px';

interface IRichTextType {
  minHeight?: number;
  width?: string | number;
  uploadImg?: (file: any) => any;
  value?: string;
  max?: number;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (v: any) => void;
  // 内容长度检测回调
  wordLimitCallback?: (v: any) => void;
}
const tinymceCDN = `/tinymce/tinymce.min.js`;
export const TincyEditor = (props: IRichTextType) => {
  const {
    minHeight = 300,
    width,
    placeholder = '请输入',
    value,
    max = 4000,
    onChange,
    uploadImg,
    disabled,
    wordLimitCallback,
    ...e
  } = props;
  const [tinymceShow, setTinymceShow] = useState(false);
  const [modalProps, setModelProps] = useState<any>({
    open: false,
    value: null,
  });
  const handleModalVisible = (open?: boolean, value?: string[], e?: any) => {
    setModelProps({ open: open || false, value: value ?? null, ...e });
  };

  const myEditorRef = useRef<any>();
  /*编辑器 表单重置问题优化*/

  // 白名单检测
  const checkDomain = (url: string) => {
    if (url.indexOf(location.host) !== -1 || /(^\.)|(^\/)/.test(url)) {
      return !0;
    }
    const white_domains = ['192.168.101.51', 'misc.jihebooks.com'];
    if (!white_domains) {
      return !0;
    }

    for (let domain in white_domains) {
      if (
        white_domains.hasOwnProperty(domain) &&
        url.indexOf(white_domains[domain]) !== -1
      ) {
        return !0;
      }
    }

    return !1;
  };
  const uploadImage = (
    images: string[],
    success: (data: any) => any,
    error: (data: any) => any,
  ) => {
    console.log('images, success, error', images, success, error);
    if (!images) {
      return !1;
    }
    let data = new FormData();
    // 需要本地化的图片地址
    data.append('urls', images);
    success({
      list: [
        {
          url: 'http://192.168.100.180/pcrm/coupon/d6648b5930a1490fb56189fbf85361b5.jpg',
          state: 'success',
          source:
            'https://statics.xiumi.us/stc/images/templates-assets/tpl-paper/image/158cee4edc6609cec9202b8d00fbaa32-sz_876390.jpg?x-oss-process=image/resize,limit_1,m_lfit,w_1080/crop,h_489,w_489,x_479,y_353',
        },
        {
          url: 'http://192.168.100.180/pcrm/coupon/d6648b5930a1490fb56189fbf85361b5.jpg',
          state: 'success',
          source:
            'https://statics.xiumi.us/stc/images/templates-assets/tpl-paper/image/158cee4edc6609cec9202b8d00fbaa32-sz_876390.jpg?x-oss-process=image/resize,limit_1,m_lfit,w_1080/crop,h_1000,w_1000,x_0,y_0',
        },
        {
          url: '',
          state: 'error',
          source:
            'https://statics.xiumi.us/mat/i/fvId/6442a48912f0da22d4f70f226911f957_sz-11704.png',
        },
      ],
    });
  };
  // 替换原有外部图片为本地化后的图片地址
  const replaceImage = (image: any, data: any, editor: any) => {
    const each = function (xs: any, f: any) {
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        f(x, i);
      }
    };
    const map = function (xs: any, f: any) {
      var len = xs.length;
      var r = new Array(len);
      for (var i = 0; i < len; i++) {
        var x = xs[i];
        r[i] = f(x, i);
      }
      return r;
    };
    const replaceString = function (content: any, search: any, replace: any) {
      let index = 0;
      do {
        index = content.indexOf(search, index);
        if (index !== -1) {
          content =
            content.substring(0, index) +
            replace +
            content.substr(index + search.length);
          index += replace.length - search.length + 1;
        }
      } while (index !== -1);
      return content;
    };
    const replaceImageUrl = function (
      content: any,
      targetUrl: any,
      replacementUrl: any,
    ) {
      let replacementString = 'src="' + replacementUrl + '"';
      content = replaceString(
        content,
        'src="' + targetUrl + '"',
        replacementString,
      );
      content = replaceString(
        content,
        'data-mce-src="' + targetUrl + '"',
        'data-mce-src="' + replacementUrl + '"',
      );
      return content;
    };
    const replaceUrlInUndoStack = function (
      targetUrl: any,
      replacementUrl: any,
    ) {
      each(editor.undoManager.data, function (level: any) {
        if (level.type === 'fragmented') {
          level.fragments = map(level.fragments, function (fragment: any) {
            return replaceImageUrl(fragment, targetUrl, replacementUrl);
          });
        } else {
          level.content = replaceImageUrl(
            level.content,
            targetUrl,
            replacementUrl,
          );
        }
      });
    };
    editor.convertURL(data.url, 'src');

    let attr = {
      src: data?.url,
      'data-mce-src': data?.url,
      alt: data?.alt,
    };
    var $ = window.tinymce.util.Tools.resolve('tinymce.dom.DomQuery');
    replaceUrlInUndoStack(image.src, data.url);
    !!data?.alt ? $(image).attr(attr) : $(image).attr(attr).removeAttr('alt');
  };
  const onPaste = (content: string, editor: any) => {
    const items = editor.getDoc().getElementsByTagName('img');
    let images: string[] = [];
    if (items.length) {
      for (var i = 0, img; (img = items[i++]); ) {
        if (img.getAttribute('word_img')) {
          continue;
        }
        var src =
          img.getAttribute('data-src') ||
          img.getAttribute('_src') ||
          img.src ||
          '';
        if (/^(https?|ftp):/gim.test(src) && !checkDomain(src)) {
          images.push(src);
        }
      }
    }
    console.log('images', images);
  };
  const onEditorChange = (content: string, editor: any) => {
    onChange?.(content);
    /*TODO 预留 网络图片本地化*/
    // handleEditorTextChange(text);
    // const items = editor.getDoc().getElementsByTagName('img');
    // let images: string[] = [];
    // console.log('items', items);
    // if (items.length) {
    //   for (var i = 0, img; (img = items[i++]); ) {
    //     if (img.getAttribute('word_img')) {
    //       continue;
    //     }
    //     var src =
    //       img.getAttribute('data-src') ||
    //       img.getAttribute('_src') ||
    //       img.src ||
    //       '';
    //     console.log('白名单', checkDomain(src), src);
    //     if (/^(https?|ftp):/gim.test(src) && !checkDomain(src)) {
    //       images.push(src);
    //     }
    //   }
    // }
    // console.log('images', images);
    // if (images.length) {
    //   uploadImage(
    //     images,
    //     (data: any) => {
    //       var i,
    //         o,
    //         item,
    //         alt,
    //         res,
    //         _src,
    //         __src,
    //         list = data?.list;
    //       console.log('=====list======', list);
    //       for (i = 0; (item = items[i++]); ) {
    //         _src =
    //           item.getAttribute('data-src') ||
    //           item.getAttribute('_src') ||
    //           item.src ||
    //           '';
    //         for (o = 0; (res = list[o++]); ) {
    //           console.log(
    //             '=====res======',
    //             _src == res.source,
    //             _src,
    //             res.source,
    //           );
    //           if (_src == res.source) {
    //             // 抓取失败时不做替换处理
    //             if (res.state == 'success') {
    //               __src = res.url;
    //               alt = '';
    //             } else {
    //               __src = '';
    //               alt = '图片上传失败！';
    //             }
    //             console.log('===========', { ...res, url: __src, alt });
    //             replaceImage(item, { ...res, url: __src, alt }, editor);
    //             break;
    //           }
    //         }
    //       }
    //       editor.save();
    //     },
    //     (error: any) => {
    //       editor.notificationManager.open({
    //         text: error || '上传出错，请重试~',
    //         type: 'error',
    //         timeout: 3000,
    //       });
    //     },
    //   );
    // }
  };
  useEffect(() => {
    setTinymceShow(true);
  }, []);
  useActivate(() => {
    setTinymceShow(true);
  });
  useUnactivate(() => {
    setTinymceShow(false);
  });

  const pathFinish = (url) => {
    const myEditor = myEditorRef.current;
    const selContent = myEditor?.selection?.getContent();
    if (url && !selContent) {
      let selNode = myEditor?.selection.getNode();
      let i = getNode(myEditor, selNode);
      myEditor.dom.setAttribs(i, {
        href: url,
      });
    } else {
      myEditor.execCommand('createlink', false, url);
    }
  };
  let uploadRef = useRef<any>();

  if (disabled) return <Disabled value={value} type="html" />;
  return (
    <div style={{ height: '100%', width }} {...e}>
      <Loading loading={!tinymceShow}>
        <Editor
          value={value || ''}
          tinymceScriptSrc={tinymceCDN}
          id="tincyEditor"
          init={{
            //window.location.origin
            language: 'zh_CN',
            base_url: `/tinymce`,
            // 刷新验证提示
            autosave_ask_before_unload: false,
            // tinymceCDN
            placeholder,
            min_height: minHeight,
            content_css: false, //设置编辑器中可编辑区域内的样式
            branding: false, //清除商标
            draggable_modal: true, //是否开启可拖动模块
            object_resizing: true,
            elementpath: false,
            statusbar: false,
            plugin_preview_width: '375px',
            paste_webkit_styles: 'all',
            powerpaste_word_import: 'merge', // 参数可以是propmt, merge, clear，效果自行切换对比
            powerpaste_html_import: 'merge', // propmt, merge, clear
            powerpaste_allow_local_images: true,
            fontsize_formats,
            paste_data_images: true, //是否允许粘贴上传 会自动调用images_upload_handler方法
            paste_enable_default_filters: false,
            lineheight_val:
              '1 1.1 1.2 1.3 1.35 1.4 1.5 1.55 1.6 1.75 1.8 1.9 1.95 2 2.1 2.2 2.3 2.4 2.5 2.6 2.7 2.8 3 3.1 3.2 3.3 3.4 4 5',
            block_formats:
              '正文=p; 一级标题=h1; 二级标题=h2; 三级标题=h3; 四级标题=h4; 五级标题=h5; 六级标题=h6;',
            font_formats:
              "微软雅黑='微软雅黑';宋体='宋体';黑体='黑体';仿宋='仿宋';楷体='楷体';隶书='隶书';幼圆='幼圆';Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings",
            images_file_types: 'jpeg,jpg,png,gif,bmp,webp,svg', //允许拖入的图片后缀
            convert_urls: false, //去除URL转换
            plugins, //,imagetools preview
            toolbar,
            ax_wordlimit_num: max,
            ax_wordlimit_event: 'SetContent Undo Redo Keyup Change',
            ax_wordlimit_callback: (
              editor: string,
              txt: string,
              num: number,
              maxNum: number,
            ) => {
              wordLimitCallback?.(num > maxNum?`文本限制长度为${num}，当前${txt.length}`?'')
            },
            // images_upload_handler: (blobInfo, success, failure) => {
            //   handleImageUpload(blobInfo.blob(), success, failure);
            // },
            init_instance_callback: function (editor) {
              // console.log('ID为: ' + editor.id + ' 的编辑器已初始化完成.');
            },
            setup: (editor) => {
              editor.ui.registry.addToggleButton('customLink', {
                icon: 'link',
                tooltip: '跳转链接',
                onAction: () => {
                  myEditorRef.current = editor;
                  let selADom = getNode(editor);
                  let href = '';
                  if (selADom) {
                    const domStr = DomToStr(selADom);
                    let b = /<a.+?href=\"(.+?)\".*>/gi;
                    let s = domStr?.match(b);
                    if (s && s.length) {
                      href = RegExp.$1;
                    }
                  }
                  handleModalVisible(true, [href.toString()]);
                },
                onSetup: (t) => {
                  function n() {
                    return t?.setActive(
                      !editor.mode.isReadOnly() &&
                        null !== getNode(editor, editor.selection.getNode()),
                    );
                  }
                  return n(), NodeChange(editor, n);
                },
              });
              editor.ui.registry.addToggleButton('customImage', {
                icon: 'image',
                tooltip: '图片上传',
                onAction: () => {
                  myEditorRef.current = editor;
                  uploadRef.current?.click?.();
                },
                onSetup: (t) => {
                  function n() {
                    return t?.setActive(
                      !editor.mode.isReadOnly() &&
                        null !== getNode(editor, editor.selection.getNode()),
                    );
                  }
                  return n(), NodeChange(editor, n);
                },
              });
            },
            menubar: false,
            // inline: true,
            quickbars_insert_toolbar: 'customImage', //无内容选择显示
            quickbars_selection_toolbar:
              'formatselect bold underline forecolor backcolor',
            contextmenu: false, //上下文
          }}
          onInit={(each) => {
            console.log('初始化');
          }}
          // onPaste={onPaste}
          onEditorChange={onEditorChange}
        />
      </Loading>
      <div style={{ display: 'none' }}>
        <Upload
          filePath={'9'}
          onChange={(e) => {
            let url = e[0].url;
            const myEditor = myEditorRef.current;
            const node = myEditor?.selection.getNode();
            url && myEditor.insertContent(`<img src="${url}">`, node);
          }}
        >
          <Button ref={uploadRef}>上传</Button>
        </Upload>
      </div>
      {isArr(modalProps.value) ? (
        <PathModal
          {...modalProps}
          handleModalVisible={handleModalVisible}
          onChange={pathFinish}
        />
      ) : null}
    </div>
  );
};
```

```ts
// util.ts
const pt = (t) => {
  return t && 'FIGURE' === t.nodeName && /\bimage\b/i.test(t.className);
};
export const NodeChange = (t: any, n: any) => {
  return (
    t.on('NodeChange', n),
    function () {
      return t.off('NodeChange', n);
    }
  );
};
export const getNode = (t: any, n?: any) => {
  return (
    (n = n || t.selection.getNode()),
    pt(n) ? t.dom.select('a[href]', n)[0] : t.dom.getParent(n, 'a[href]')
  );
};
export const DomToStr = (dom: any) => {
  const nodeToString = (node: any) => {
    let tmpNode = document.createElement('div');
    tmpNode.appendChild(node.cloneNode(true));
    let str = tmpNode.innerHTML;
    tmpNode = node = null;
    return str;
  };
  return nodeToString(dom).replace('<', '<').replace('>', '>');
};
```
