---
layout:     post
title:      "Javascript: void(0);"
subtitle:   "为啥我们的代码中会用到void？"
description: "js Javascript void"
keyword:    "js Javascript void"
date:       2017-01-02
author:     "xzavier"
catalog: true
tags:
    - Javascript
---

## 背景

其实我们并没有经常在我们的js代码里使用到 `void` 关键字，但是也经常看到和使用到：

    <a href="javascript: void(0);" id="one">xzavier</a>

我在之前学习的时候，就知道 `javascript:` 这玩意儿是个伪协议，让href逝去其默认的行为，从而执行js代码，然后 `void(0); `吧，就是什么都没发生，使用的时候吧，也使用的666，非常自然。

前几天，脑壳一热，换了种写法 `javascript: ;` 和 `javascript: 0;` ，在 Firfox 里，点击弹出新的空页面。

这个功能吧，其实本身设计也是点击跳转的，只不过要判断平台，跳转不同的页面，所以用了 `javascript: void(0);` 阻止跳转，然后在js代码里实现跳转。

有没有疑问？为啥一定要用 `a 标签` 呢？人家 a 标签 本来就是设计来路由跳转的。是，说的对，但是历史的脚步不会因为一个 a标签 而改变，哈哈，严重了，意思就是历史原因，需要和其他模板保持一致，所以这样使用有它的道理。

所以其他时候，还是按照语义布局才是真理。

## 问题

在 Firfox 里，点击弹出新的空页面。QA也记录我这个问题，桑心，没事儿，让我找清楚你啥原因。

`void(0)` 到底干嘛的？其他写法为啥不行？

## void(0)

void expression

>The void operator evaluates the given expression and then returns undefined.

MDN描述：

>这个运算符能向期望一个表达式的值是undefined的地方插入会产生副作用的表达式。

>void 运算符通常只用于获取 undefined的原始值，一般使用void(0)（等同于void 0）。在上述情况中，也可以使用全局变量undefined 来代替（假定其仍是默认值）。

也就是说，void 运算符 对给定的表达式进行求值，然后返回 `undefined`。

所以，我们要的不仅是 `void(0)`， 可以是： `void 0` ， `void 1` ， `void (function(){})` ， `void 'any expression'` 。

嗯，没毛病，href标签里那样写也就是要这个效果。就给我反个 undefined 吧，我什么都不想做。

## 思索

既然你只想什么都不做，你只想要个 undefined ，你说啊，我给你啊。

不，你给我爱不纯洁，噢，不是，你给我的 `undefined` 不纯洁。

嗦嘎，在js中，undefined 并不是保留字（reserved word），它只是全局对象的一个属性，在低版本 IE 中能被重写。比如：

    var undefined = 'xzavier';
    alert(undefined); // xzavier

但在chrome ， Firfox里是不行的，因为ES5规范里 undefined 是只读的:

    var undefined = 'xzavier';
    console.log(undefined); // undefined

不过，那只是全局的情况，在局部作用域中，还是可以被重写：

    (function() {
       var undefined = 'xzavier';
       console.log(undefined);  // xzavier
    })();
    
    function testUndefined() {
        var undefined = 1,
            xzavier = undefined + 1;
        con`sole.log(xzavier);
    }
    
    testUndefined();  // 2

不过，不同浏览器实现还是不同的。

## 解决

MDN 文档下面有一条：

>当用户点击一个以 javascript: URI 时，它会评估URI中的代码，然后用返回的值替换页面内容，除非返回的值是undefined。void运算符可用于返回undefined。例如：

    <a href="javascript:void(0);">
      这个链接点击之后不会做任何事情，如果去掉 void()，
      点击之后整个页面会被替换成一个字符 0。
    </a>
    <p> chrome中即使<a href="javascript:0;">也没变化，firefox中会变成一个字符串0 </p>
    <a href="javascript:void(document.body.style.backgroundColor='green');">
      点击这个链接会让页面背景变成绿色。
    </a>

回到我们的问题，也就可以解释了为啥 Firfox打开一个空页面了，打开一个URL为 字符串为0 或 字符串为空 的一个页面。

我写了 `javascript: 0;`  `javascript: ;` ，Chrome是可以的，那说明Chrome把 0 这个表达式返回了 undefined ，没错，那其实就是浏览器的实现差异了。

最后，感觉 `javascript: void(0); `成为了一种公约，反正各个浏览器都没问题，而且，我平时不会再js代码里这样写，但我们熟知的 `underscore` 里面的 `undefiend` 都用 `void 0` 替代了，不信你去看看。[underscore 注释版][1]

## More

除了这个 void(0); MDN 上还介绍了 void 用于立即调用的函数表达式的用法。

>在使用立即执行的函数表达式时，可以利用 void 运算符让 JavaScript 引擎把一个function关键字识别成函数表达式而不是函数声明（语句）。

    void function iife() {
        var bar = function () {};
        var baz = function () {};
        var foo = function () {
            bar();
            baz();
         };
        var biz = function () {};
    
        foo();
        biz();
    }();

    void function iife() {
        console.log('xzavier');
    }();
    // xzavier


  [1]: https://github.com/hanzichi/underscore-analysis/blob/master/underscore-1.8.3.js/underscore-1.8.3-analysis.js
