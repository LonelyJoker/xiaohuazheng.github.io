---
layout:     post
title:      "截图上传"
subtitle:   "上传clipboardData里的图片内容"
description: "截图上传 clipboardData"
keyword:    "截图上传 clipboardData"
date:       2020-02-06
author:     "xzavier"
catalog: true
tags:
    - CSS
---

疫情期间，在家办公，虽说少了上班路上的消耗，但工位确实没有公司舒服。希望疫情早点过去，我们摘下口罩，欢快地讨论技术和需求。

上传截图在我们平时的开发中少有遇到，遇到了我们就自己实现一把。嗯，截图的事情，与产品讨论后，我们就不实现了，不管是微信，QQ，还是我们自家社交APP，毫无疑问截图这个功能是不可或缺的。

### 思路

- 截完图，得找个地方粘贴
- 粘贴，我们就能拿到剪切板的内容，从而过滤出图片
- 然后上传，得到完整的图片地址用以展现
- 修饰一下粘贴框，限制一些交互

嗯，这样应该勉强可以了。在UI的帮助下，我们实现得漂漂亮亮。

源代码就不出了，我重新用jQuery实现一遍，又不能上传到我家的地址，就在antd的上传页面，我们捣鼓一下吧。

### Code

    (function() {
        // FileReader 实例
        let reader = new FileReader();
        // 预览
        reader.onload = (e) => {
            $('.preview-img-box').html(`<h3>预览：</h3><img src="${e.target.result}" class="upload-image" style="width: 100%;border: 1px solid #ddd;" />`);
        }

        // 初始化
        let init = () => {
            addJQuery();
        }
    
        // 添加JQuery到页面上，因为我们要使用
        let addJQuery = () => {
            let head = document.getElementsByTagName('head')[0];
            let script = document.createElement('script');
            script.type= 'text/javascript';
            script.onload = script.onreadystatechange = function() {
                if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete" ) {
                    //  成功后我们把页面改成我们的粘贴框，自己写的样式，肯定将就看了
                    $('body').html('<div class="xzavier-box" style="padding: 20px;"><div style="border: 1px solid #ccc; overflow: hidden;width: 300px; height: 60px; margin: 0 auto;"><div class="screentshot-paste" contentEditable style="float: left; width: 100%; height: 100%; padding: 2px 10px; line-height: 54px"></div></div><div class="file-res-info" style="width: 300px;height: auto;word-break: break-all;margin: 20px auto 0;"></div></div>');
    
                    // 绑定交互事件
                    bindEvents();
                    // Handle memory leak in IE
                    script.onload = script.onreadystatechange = null;
                }
            };
            script.src = 'https://libs.baidu.com/jquery/2.0.0/jquery.min.js';
            head.appendChild(script);
        }
    
        // 添加事件监听
        let bindEvents = () => {
            // 输入框粘贴事件
            $('.screentshot-paste').on('paste', function(e) {
                onScreenShotPaste(e);
            });
    
            // 如果你不需要粘贴框，那可以直接在document上监听事件
            // document.addEventListener('paste', function (e) {
            //     onScreenShotPaste(e);
            // });
    
            // 粘贴框不能输入内容
            $('.screentshot-paste').on('input', function(e) {
                e.preventDefault();
                $('.screentshot-paste').html('');
            });
        }
    
        // 监听截图粘贴
        let onScreenShotPaste = e => {
            e.preventDefault();
    
            // 获取粘贴的图片
            let pasteFiles = getPasteImage(e);
            if (!pasteFiles || !pasteFiles.length) {
                return;
            }
            
            // reader 读取数据用于预览
            reader.readAsDataURL(file);
    
            // 上传
            doUpload(pasteFiles[0]);
        }
    
        // 获取粘贴的图片文件
        let getPasteImage = e => {
            let res = [];
            let text = getPasteText(e);
            // 粘贴的是文字，忽略
            if (text) {
                $('.screentshot-paste').html('');
                return null;
            }
    
            // 解析粘贴板内容
            let clipboardData = e.clipboardData || e.originalEvent && e.originalEvent.clipboardData || {};
            let items = clipboardData.items;
            if (!items) {
                return null;
            }
            
            for (let item of Object.values(items)) {
                // 获取image内容
                if (/image/i.test(item.type)) {
                    res.push(item.getAsFile());
                }
            }
    
            return res;
        }
    
        // 解析粘贴的文本
        let getPasteText = e => {
            let clipboardData = e.clipboardData || e.originalEvent && e.originalEvent.clipboardData;
            let pasteText;
            if (!clipboardData) {
                pasteText = window.clipboardData && window.clipboardData.getData('text');
            } else {
                pasteText = clipboardData.getData('text/plain');
            }
    
            return encodeHtmlTag(pasteText);
        }
    
        // 转换 html 字符
        let encodeHtmlTag = html => {
            if (!html) {
                return '';
            }
            return html.replace(/</gm, '&lt;').replace(/>/gm, '&gt;').replace(/"/gm, '&quot;').replace(/(\r\n|\r|\n)/g, '<br/>');
        }
        
        // 构建上传参数
        let buildFormData = (file, ts) => {
            let form = new window.FormData();
            form.append('file', file);
            form.append('_timestamp', ts);
            return form;
        }
    
        // 执行上传 - 上传地址就选antd上传组件里的地址了
        let doUpload = file => {
            let ts = new Date().getTime();
            let params = buildFormData(file, ts);
    
            $.ajax({
                type: 'post',
                url: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
                data: params,
                processData: false,
                contentType: false,
                success: res => {
                    console.log(res);
                    $('.file-res-info').html(JSON.stringify(res));
                    // 上传回来是固定的地址，看来是他们搞的鬼，没关系，我们的测验是成功了的
                },
                error: e => {
                    console.log(e);
                },
                timeout: 100000
            });
        }
    
        init();
    }());


打开[这个页面][1]，打开控制台console，输入以上代码，回车，页面就变成你想看到的样子了。试试吧。

### 预览

如果想要上传前预览照片，那么就需要修改一下逻辑，改之前的粘贴后上传为粘贴后点击上传。

这个时候我们可以使用进行预览

    let reader = new FileReader()
    reader.onload = function(e) {
        // e.target.result就是图片的base64编码
        console.log(e.target.result);
        // TODO 用img实现预览
    }
    
    // 调用readAsDataURL转换二进制文件为图片base64
    reader.readAsDataURL(file);

### 资料

- [ClipboardEvent.clipboardData][2]
- [getAsFile][3]
- [FileReader][4]


  [1]: https://ant.design/components/upload-cn/
  [2]: https://developer.mozilla.org/zh-CN/docs/Web/API/ClipboardEvent/clipboardData
  [3]: https://developer.mozilla.org/zh-CN/docs/Web/API/DataTransferItem/getAsFile
  [4]: https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader



