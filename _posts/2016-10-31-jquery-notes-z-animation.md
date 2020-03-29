---
layout:     post
title:      "jQuery笔记（2）"
subtitle:   "动画效果"
description: "js jQuery jQuery animate"
keyword:    "js jQuery jQuery animate"
date:       2016-10-31
author:     "xzavier"
catalog: true
tags:
    - jQuery
---

## jQuery-动画效果浅析

动画可以给网站的用户体验加分，让网页更加活泼。不过，什么东西都需要适量，简易快捷的动画会给网站加分不少。比如购物网站的个人中心按钮hover效果啊，各种hover产生的动画等。不过，现在CSS3的新特性可以模拟很多动画，可以多用CSS3去实现一些动画效果了。比如`box-shadow，text-shaow，animation，transform`等。jquery作为全明星级别插件，是有很强的动画功能的。

### 全局属性

jQuery在动画中提供了两个全局属性（不常在代码中使用），分别为：
`$.fx.interval`，设置每秒运行的帧数，默认13ms，越小越流畅，但太小耗费浏览器性能
`$.fx.off`，关闭页面上所有的动画，浏览器不支持动画时可以全部关掉。

    $.fx.interval = 100; //默认为13
    $.fx.off = true; //默认false

那么，我们看看jquery都提供了哪些动画方法。

### 显示&&隐藏

jQuery 中显示方法为：`.show(speed,callback)`，隐藏方法为：`.hide(speed,callback)`。在无参数的时候，只是硬性的显示内容和隐藏内容。

    $('.show').click(function () { 
        $('.xzavier').show();
    });
    $('.hide').click(function () { 
        $('.xzavier').hide();
    });

两个可选参数。参数speed，毫秒，表示运动所花时间，用速度来说更切合动画一词。可以是number，也可以是这个三个参数字符串：slow、normal 和fast，分别对应600ms、400 ms和200ms。如果传参错误或者不传，默认normal，即400ms。参数callback代表回调函数。
    
    $('.show').click(function () {
        $('.xzavier').show('fast'); 
    });
    $('.show').click(function () {
        $('.xzavier').show('');   //normal
    });

    $('.show').click(function () {
        $('.xzavier').show('fast', function () {
            console.log('animation is over');  //其他可执行代码
        });
    });

原理上，`.hide(speed,callback)`方法其实就是在行内设置CSS 代码：`display:none;` 而`.show(speed,callback)`方法要根据原来元素是区块还是内联来决定，如果是区块，则设置CSS 代码：`display:block;` 如果是内联，则设置CSS 代码：`display:inline;`。

`.show()`和`.hide()`的在同一元素的时候，需要一个按钮切换操作，或者需要进行一些条件判
断。而jQuery 提供给我们一个类似功能的独立方法：`.toggle(speed,callback)`，自动切换。

    $('.toggle').click(function () {
        $(this).toggle('fast');
    });

### 收缩&&展开

jQuery 提供了一组改变元素高度的方法：`.slideUp(speed,callback)`，向上收缩、`.slideDown(speed,callback)`，向下展开和`.slideToggle(speed,callback)`，自动切换。

    $('.slidedown').click(function () {
        $('.xzavier').slideDown('slow');
    });
    $('.slideup').click(function () {
        $('.xzavier').slideUp();
    });
    $('.slidetoggle').click(function () {
        $('.xzavier').slideToggle('fast');
    });

### 淡入&&淡出
jQuery 提供了一组专门用于透明度变化的方法：`.fadeIn(speed,callback)`，淡入、`.fadeOut(speed,callback)`，淡出、`.fadeToggle(speed,callback)`，自动切换。

    $('.fadein').click(function () {
        $('.xzavier').fadeIn('slow');
    });
    $('.fadeout').click(function () {
        $('.xzavier').fadeOut();
    });
    $('.fadetoggle').click(function () {
        $('.xzavier').fadeToggle('fast');
    });

这三个方法只能透明度变化只能从0 到100，或者从100 到0。不能自己设定变化到一个值。不过，jQuery提供了`.fadeTo(speed,opacity，callback)`方法解决了这个问题。

    $('.fadeto').click(function () {
        $('.xzavier').fadeTo('1000', 0.4); //0.4代表上面方法的30
    });

如果本身透明度大于指定值，会淡出，否则相反。

### 自定义动画

jQuery提供了几种简单常用的固定动画方法供开发使用。随着业务逻辑的复杂，这些简单动画无法满足我们更加复杂的需求。这时，开发可以使用jQuery提供了一个`.animate(params,speed,easing,callback);`方法来创建我效果更为复杂的自定义动画。
参数为：CSS变化样式的对象（必传），速度（可选），回调函数（可选）。easing后面解释。

    .xzavier {width:200px;height:100px;opacity:1;}
    $('.animate').click(function () {
        $('.xzavier').animate({
            'width' : '800px',
            'height' : '400px',
            'opacity' : 0.3
        });
    });

class为xzavier的盒子多重动画同步运动。变宽，变长，变淡。

    $('.animate').click(function () {
        $('.xzavier').animate({
            'top' : '400px', 
            'left' : '200px'
        });
    });

如果元素位置需要运动变化，需要设置元素的position为`absolute`。

jQuery还提供了自定义动画的累加、累减功能。

    $('.animate').click(function () {
        $('.xzavier').animate({
            'top' : '+=100px',
            'left' : '+=100px'
        });
    });

包括jquery固定的几个动画在内，都有可选参数easing，即运动方式，seasing有两个值：`swing`(缓动)、`linear`(匀速)，默认为swing。不过这个参数很少用到O(∩_∩)O~

    $('.animate').click(function () {
        $('.xzaiver').animate({
            left : '800px'
        }, 'slow', 'swing');
        $('.xzavier').animate({
            top : '40px'
        }, 'fast', 'linear');
    });

### 列队动画

自定义实现列队动画的方式，有3种：

1.在回调函数中再执行一个动画

    $('.animate').click(function () {
        $('.xzavier').animate({
            'left' : '800px'
        }, function () {
            $('.xzavier').animate({
                'top' : '400px'
            }, function () {
                $('.xzavier').animate({
                    'opacity' : 0.3
                });
            });
        });
    });

2.通过连缀来实现列队动画

    $('.animate').click(function () {
        $('.xzavier').animate({
            'left' : '800px'
        }).animate({
            'top' : '400px'
        }).animate({
            'opacity' : 0.3
        });
    });

3.通过顺序来实现列队动画（需要时同一元素动画，否则，就是同步动画）

    $('.animate').click(function () {
        $('.xzavier').animate({'left' : '100px'});
        $('.xzavier').animate({'top' : '100px'});
        $('.xzavier').animate({'opacity' : 0.3});
    });

这样来看，我们更倾向于后面两种写法，因为嵌套多了就出现了}}}}}}}}}}

### 连缀非动画方法

先看个问题：

    //连缀
    $('.xzavier').slideUp().slideDown().css('background', '#ccc');

这里面css方法并不是动画方法，不会排在列队之后执行，但是，我们又需要它在前面动画执行之后再执行。这是，肯定会想到采用回调函数来解决。

    $('.xzavier').slideUp().slideDown(function () {
        $(this).css('background', '#ccc');
    });

确实可以解决问题，但是当列队动画变多时，回调函数`}}}}}}}}}}`的可读性大大降低确实一个非常烦人的问题。jQuery 提供了一个类似于回调函数的方法：.queue()。.queue()方法将css方法跟随动画方法之后。如果还需继续调用动画方法，使用.dequeue()方法。

    $('.xzavier').slideUp();
    $('.xzavier').slideDown();
    $('.xzavier').queue(function () {
        $(this).css('background', '#ccc');
        $(this).dequeue();
    })
    $('.xzavier').hide('slow');

### 停止动画&&延迟动画

停止正在运行中的动画：.stop()方法。可选参数：`clearQueue`, `gotoEnd`。clearQueue 传递一个布尔值，代表是否清空未执行完的动画列队，gotoEnd 代表是否直接将正在执行的动画跳转到末状态。

    $('.stop').click(function () {
        $('.xzavier').stop(true ,true);
    });

延迟执行动画：.delay()方法。可以在动画之前设置延迟，也可以在列队动画设置。

    $('.animate').click(function () {
        $('.xzavier').delay(1000).animate({
            'opacity' : 0.3
        }, 1000);
        $('.xzavier').delay(1000).animate({
            'width' : '800px'
        }, 1000);
        $('.xzavier').animate({
            'height' : '400px'
        }, 1000);
    });

周末好天气，打篮球去咯。代码，篮球，生活...
