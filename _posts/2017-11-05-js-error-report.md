---
layout:     post
title:      "前端异常监控上报"
subtitle:   "代码报错 & 请求异常 & 主动上报"
date:       2017-11-05
author:     "xzavier"
catalog: true
tags:
    - Javascript
---


## 背景

在团队日渐庞大，代码越来越多人维护的时候，开发自测、同事Code Review 、QA测试不论怎样覆盖都不能完全避免代码的异常。这时候用代码去监控代码，上报错误日志，并针对性的修改优化，可以提升找错效率，提升前端代码安全性。当然，这也是我前端时间做的事情。

## js错误类型

主要包含以下几个：

    SyntaxError    语法错误 - 解析代码时发生的语法错误。
    ReferenceError 引用错误 - 引用一个不存在的变量时发生的错误。
    RangeError     范围错误 - 当一个值超出有效范围时发生的错误。
    TypeError      类型错误 - 是变量或参数不是预期类型时发生的错误。

还有其他如 `URIError` 、 `EvalError` 等。

## 监控

前端主要监控code error，并上报，这个主要用到 `try..catch` 和 `window.onerror` 。

前端怎么能少了调用 `XMLHttpRequest` 向服务器发送 Ajax 请求，那也需要监听ajax arror。

如果你使用的是jQuery，那么 `$(document).ajaxError` 这个全局事件就可以帮助你捕获的错误信息。

如果没有使用这个库，也阔以修改 `window.XMLHttpRequest` ，在 `XMLHttpRequest` 中监听 error并上报。接下来我们慢慢来说。

## 浏览器信息

你上报错误的时候，可能需要包含很多参数，其中浏览器信息，如：

    device: clintInfo.device,  // 设备
    browser: clintInfo.browser + '@' + clintInfo.version, // 浏览器@版本
    engine: clintInfo.engine, // 内核
    os: clintInfo.os + '@' + clintInfo.osVersion, // 操作系统@版本
    language: clintInfo.language // 语言

这些基本可以用 `navigator.userAgent` 、 `navigator.language` 获取到信息，具体的就自己实现或者 github 找资源了。

## 上报

对于上报的请求，越小越好，可以不用ajax请求，一般可以请求一张零像素图片，然后跟上一堆参数，后端就可以解析出错误参数了。

参数根据你需要统计的决定，可以添加一些浏览器参数，方便排查兼容性等：

    // 上报参数配置
    WeJsReport.settings = {
        reportUrl: _s['jsReportUrl'],
        reportProject: _s['appName'],
        reportClient: {
            device: clintInfo.device,
            browser: clintInfo.browser + '@' + clintInfo.version,
            engine: clintInfo.engine,
            os: clintInfo.os + '@' + clintInfo.osVersion,
            language: clintInfo.language
        }
    }

    // 统一上报函数
    WeJsReport.doReport = function(errMsg, errType) {
        //上报类型，我暂时分类jsError , ajaxError, accordError(主动上报) 
        errType = errType || 'accordError'; 
    
        var ss = WeJsReport.settings;
        if (ss.reportUrl) {
            var src = ss.reportUrl + (ss.reportUrl.indexOf('?') > -1 ? '&' : '?') + 'errType='+ errType + '&errMsg=' + errMsg;
            for (var i in ss.reportClient) {
                if (ss.reportClient.hasOwnProperty(i)) {
                    src += '&' + i + '=' + ss.reportClient[i];
                }
            }
            
            src += ('&href=' + location.href + '&project=' + ss.reportProject + '&t=' + new Date().getTime());
            new Image().src = src;
        }
    }

这是用请求img的方式上报，也阔以直接发送ajax请求上报日志。

## window.onerror

- msg {String}   错误信息。直观的错误描述信息，不过压缩后代码的报错信息，并不直观。
- url {String}   发生错误对应的脚本路径。
- line {Number}  错误发生的行号。
- col {Number}   错误发生的列号。
- error {Object} 具体的 error 对象，包含详细的错误调用堆栈信息。

以上是 `onerror` 的五个参数。对于低版本的IE，后面几个参数获取不到，这时候你就针对性的关心 `msg` 参数就好。

    window.onerror = function(msg, url, line, col, error) {
        console.log("错误信息：" , msg);
        console.log("出错文件：" , url);
        console.log("出错行号：" , line);
        console.log("出错列号：" , col);
        console.log("错误详情：" , error);
    
        // 把这些信息组装起来，就可以上报了
    
        var errMsg = '';
     
        WeJsReport.doReport(errMsg, 'jsError');
    }

写个demo试一下就能看到打印的信息了。

### 跨域JS

不过一般来说，你的js都是放在cdn上的，或者与你的页面不同域。

而对于跨域的JS资源，`window.onerror` 拿不到详细的信息，只能获得一个固定的字符串 `Script error` 。 为什么呢，因为浏览器实现script资源加载的地方，是进行了同源策略判断的，目的是避免数据错误信息里面包含的信息泄露到不安全的域中。如果是非同源资源，errorMessage就固定为 `Script error`。

解决方案为往资源的请求添加额外的头部：

>后端将js文件的请求的Access-Control-Allow-Origin设置为"*"

    header('Access-Control-Allow-Origin: *');

>前端在script标签中加入crossorigin属性。

    <script src="bundle.6wfzn7v5.min.js?v=1.0" crossorigin></script>

### Source Map

开发的时候，我们一般都能捕获到想要的信息，但是我们发到线上的代码，`bundle.6wfzn7v5.min.js?v=1.0` ，是压缩过的，捕获到的错误信息全在第一行，报错的信息也是做过混淆的 `a , b, i, n` ，要想深入了解错误信息，就需要用到 [Source Map][1] 了。

不过这个其实没有那么重要，现在代码基本都是模块化，组件化，你的代码报错了，只要能找到文件，其实也阔以很快定位到原因的。而且，这个 Source Map 放到线上，也会有不安全的因素，起码暴露给了开发者。


## 主动上报

### try...catch

    try {
        throw new Error('error');
    } catch (e) {
        console.log(e);
        var errMsg = ''; // 组装上报错误信息
        WeJsReport.doReport(errMsg, 'jsError');
    }

`try...catch` 可以拿到出错的信息，堆栈，出错文件，行号，列号等等。但无法捕捉到语法错误，也没法去捕捉全局的异常事件。

而且，是同步调用的，如果在 `try` 里执行异步，`catch` 无法捕捉到回调函数里抛出的异常，因为当回调函数从队列里被拉出来执行的时候 `try...catch` 所在的代码块已经执行完了。不过可以用 `window.onerror` 监听到的。

### 动态加载

对于 `img` 、`link` 、`script` 资源的动态加载，可以通过给标签添加 onerror 回调函数，获取到这类资源是否加载成功，然后上报日志。

例：

    var wxscript = document.createElement('script');
    wxscript.src = '//res.wx.qq.com/open/js/jweixin-1.0.0.js';
    wxscript.onload = function() {};
    wxscript.onerror = function(e) {
        WeJsReport.doReport('wx script load fail', 'accordError');
    };
    document.body.appendChild(wxscript);

### code上报

非代码报错，但业务需要，在代码走到了某个逻辑的时候，需要上报一个日志，也阔以用这个日志报错：

    WeJsReport.doReport('some description', 'accordError');

后端经常会有日志，有时候一些标志错误的返回码，可能也需要前后端一起记录日志，对比分析也是阔以的。


## Ajax Error

一般来说，请求出错，要求后端做好日志监控，还是可以排查出大部分问题。不过，前端也阔以监听ajax error，这样就更有力的保障代码健康和提高问题排查的效率。

### jQuery ajaxError

如果项目里使用了jQuery，可以使用 jQuery 的 Global Ajax Event Handlers 监听到 Ajax 事件。`$(document).ajaxError`就可以监听到请求异常。

    $(document).ajaxError(function(event, xhr, options, exc) {
        console.log("event 对象：" , event);
        console.log("XMLHttpRequest 对象：" , xhr);
        console.log("url&type等参数：" , options);
        console.log("javaScript exception：" , exc);
        
        // 把这些信息组装起来，就可以上报了
    
        var errMsg = '';
    
        WeJsReport.doReport(newMsg, 'ajaxError');
    });

### XMLHttpRequest

如果是原生的，那就需要重载 `XMLHttpRequest` 了，其实像听云这样的监控平台也是这么做，只是他们在这方面比较专业一点。

    ;(function() {
        if (typeof window.CustomEvent === "function") return false;
    
        function CustomEvent(event, params) {
            params = params || {
                bubbles: false,
                cancelable: false,
                detail: undefined
            };
            var evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        }
    
        CustomEvent.prototype = window.Event.prototype;
    
        window.CustomEvent = CustomEvent;
    })();;
    (function() {
        function ajaxEventTrigger(event) {
            var ajaxEvent = new CustomEvent(event, {
                detail: this
            });
            window.dispatchEvent(ajaxEvent);
        }
    
        var oldXHR = window.XMLHttpRequest;
    
        function newXHR() {
            var realXHR = new oldXHR();
    
            realXHR.addEventListener('abort', function() {
                ajaxEventTrigger.call(this, 'ajaxAbort');
            }, false);
    
            realXHR.addEventListener('error', function() {
                ajaxEventTrigger.call(this, 'ajaxError');
            }, false);
    
            realXHR.addEventListener('load', function() {
                ajaxEventTrigger.call(this, 'ajaxLoad');
            }, false);
    
            realXHR.addEventListener('loadstart', function() {
                ajaxEventTrigger.call(this, 'ajaxLoadStart');
            }, false);
    
            realXHR.addEventListener('progress', function() {
                ajaxEventTrigger.call(this, 'ajaxProgress');
            }, false);
    
            realXHR.addEventListener('timeout', function() {
                ajaxEventTrigger.call(this, 'ajaxTimeout');
            }, false);
    
            realXHR.addEventListener('loadend', function() {
                ajaxEventTrigger.call(this, 'ajaxLoadEnd');
            }, false);
    
            realXHR.addEventListener('readystatechange', function() {
                ajaxEventTrigger.call(this, 'ajaxReadyStateChange');
            }, false);
    
            return realXHR;
        }
    
        window.XMLHttpRequest = newXHR;
    })();;

>此段代码转自：https://blog.ttionya.com/article-1511.html 

可以在 error 事件里添加异步上报日志代码，这样就可以监听全局的ajax请求了。

    realXHR.addEventListener('error', function() {
        ajaxEventTrigger.call(this, 'ajaxError');
        // 异步上报日志
        console.log('override XMLHttpRequest ajax error');
    }, false);

## 排异

有时候有的浏览器执行自己的js会报错，有时候你引用的第三方js也会报错，各种各样的错误会另你的日志难以分析或严重增加你的排查分析时间。

这时候我们需要建立日志上班黑白名单，让你只关心你想关心的日志。当然，初期我还是觉得都统计一下，然后慢慢分析，慢慢优化，别一开始就一竿子打死所有。

## 节流

我现在项目错误上报数据量还不大，还没有加入节流。不过需要做好这方面的准备。

当数据量变大的时候，当一个异常一段时间内不断触发，那么上报的日志会造成数据冗余，也造成流量浪费。所以，对于错误信息的上报，从上报内容和上报频率上，应该加以限制：

- 1、限制上报：不是所有的错误都上报，添加黑白名单，或者添加过滤条件，满足条件的的才上报。
- 2、合并上报：一段时间内统一的错误汇总上报，减少请求。
- 3、服务端限制：客户端的东西总是可以绕开，服务端需要做限制，防止被攻击，或者负载过高。

一步一步慢慢优化。


  [1]: http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html
  [2]: https://blog.ttionya.com/article-1511.html