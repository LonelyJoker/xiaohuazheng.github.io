---
layout:     post
title:      "心愿墙"
subtitle:   "年会娱乐项目"
description: "年会 前端"
keyword:    "前端 年会 css3 video"
date:       2018-02-11
author:     "xzavier"
catalog: true
tags:
    - Javascript
---

接着上一茬儿。

今儿讲讲心愿墙。

这里面没有牛逼的技术，代码也不完整。只是记录一下我遇到的问题和我解决问题的一些心路历程。

在明确了要做什么，做成什么样的时候。

>不断以弹幕的形式滚动心愿，在抽取的时候随机抽取心愿并以某个效果展示出来。

效果这个，我想css3+js就足够了。弹幕嘛，我想到了张鑫旭老师的一篇关于弹幕的canvas博客。
于是我也这么搞。

### canvas

方法改自： [张鑫旭-使用canvas实现和HTML5 video交互的弹幕效果][1]

    // 弹幕方法
    function canvasBarrage(canvas, data) {
        if (!canvas || !data || !data.length) {
            return;
        }
        if (typeof canvas == 'string') {
            canvas = document.querySelector(canvas);
            canvasBarrage(canvas, data);
            return;
        }
    
    
        var context = canvas.getContext('2d');
        canvas.width = 1366; //window.innerWidth;
        canvas.height = 768; //window.innerHeight;
    
        // 存储实例
        var store = {};
    
        // 字号大小
        var fontSize = 28;
    
        // 实例方法
        var Barrage = function(obj, index) {
            // 随机x坐标也就是横坐标，对于y纵坐标，以及变化量moveX
            this.x = (1 + index * 0.1 / Math.random()) * canvas.width / 3;
            this.y = obj.range[0] * canvas.height + (obj.range[1] - obj.range[0]) * canvas.height * Math.random() + 100;
            if (this.y < fontSize) {
                this.y = fontSize;
            } else if (this.y > canvas.height - fontSize) {
                this.y = canvas.height - fontSize;
            }
            this.moveX = Math.floor(1 + Math.random() * 5);
    
            this.opacity = 0.8 + 0.2 * Math.random();
            this.params = obj;
        
            context.font = 'bold ' + fontSize + 'px "microsoft yahei", sans-serif';
    
            this.draw = function() {
                var params = this.params;
                // 根据此时x位置绘制文本
                context.fillStyle = params.color;
                
                context.fillText(params.value, this.x, this.y);
            };
        };
    
        data.forEach(function(obj, index) {
            store[index] = new Barrage(obj, index);
        });
    
        // 绘制弹幕文本
        var draw = function() {
            for (var index in store) {
                var barrage = store[index];
                // 位置变化
                barrage.x -= barrage.moveX;
                if (barrage.x < -1 * canvas.width / 3) {
                    // 移动到画布外部时候从左侧开始继续位移
                    barrage.x = (1 + index * 0.1 / Math.random()) * canvas.width;
                    barrage.y = (barrage.params.range[0] + (barrage.params.range[1] - barrage.params.range[0]) * Math.random()) * canvas.height;
                    if (barrage.y < fontSize) {
                        barrage.y = fontSize;
                    } else if (barrage.y > canvas.height - fontSize) {
                        barrage.y = canvas.height - fontSize;
                    }
                    barrage.moveX = Math.floor(1 + Math.random() * 5);
                }
                // 根据新位置绘制圆圈圈
                store[index].draw();
            }
        };
    
        // 画布渲染
        var render = function() {
            // 清除画布
            context.clearRect(0, 0, canvas.width, canvas.height);
    
            // 绘制画布上所有的圆圈圈
            draw();
    
            // 继续渲染
            requestAnimationFrame(render);
    
        };
    
        render();
    }
    
    var data = [{
            "value": "一本书 - javaScript高级程序设计",
            "color": "black",
            "range": [0.7, 1]
        }];
    canvasBarrage('#canvasBarrage', data);

然后，再考虑到性能，也学习了下，顺便优化一下[Canvas 最佳实践（性能篇）][2]

在我的开发机器上啊，运行着着实没啥问题，非常的流畅。但是到导演的机器上，毛病就出来了。运行起这个心愿墙，电脑就卡了，弹幕跑起来不流畅，还影响别的进程。

打开任务管理器，我去，CPU使用率高达80%，关掉这个页面，瞬间回到三四十。显然，这个方案，是不满意的。

于是，我就想着优化，肯定不能让同事们看到这么难看的画面。毕竟里面可能有我喜欢的女孩呢。

再经历过一番查阅和改造之后，发现要达到产品的效果，canvas无论怎样优化，始终会占用很高的CPU使用率。这个也不涉及高量计算，也用不了web worker。时间紧迫，不能就这么耗着。

换方案。

### DOM

想着最快的方案，不就是让弹幕一点一点的向左移动嘛。干脆点，直接position: absolute，加频繁改动left值，就可以实现效果了，还不耽误时间，哈哈。

    function DomBarrage(id) {
    
        this.domList = [];
        this.dom = document.querySelector('#' + id);
        if (this.dom.style.position == '' || this.dom.style.position == 'static') {
            this.dom.style.position = 'absolute';
        }
        this.dom.style.overflow = 'hidden';
        var rect = this.dom.getBoundingClientRect();
        this.domWidth = rect.right - rect.left;
        this.domHeight = rect.bottom - rect.top;
    
        this.shoot = function(one) {
            var div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.left = this.domWidth + 'px';
            div.style.top = (this.domHeight - 60) * +Math.random().toFixed(2) + 'px';
            div.style.whiteSpace = 'nowrap';
            div.style.color = one.color;
            div.innerText = one.value;
            this.dom.appendChild(div);
    
            var roll = function(timer) {
                var now = +new Date();
                roll.last = roll.last || now;
                roll.timer = roll.timer || timer;
                var left = div.offsetLeft;
                var rect = div.getBoundingClientRect();
                if (left < (rect.left - rect.right)) {
                    this.dom.removeChild(div);
                } else {
                    if (now - roll.last >= roll.timer) {
                        roll.last = now;
                        left -= 4;
                        div.style.left = left + 'px';
                    }
                    requestAnimationFrame(roll);
                }
            }
            roll(50 * +Math.random().toFixed(2));
        }
    }
    
    var barage = new DomBarrage('canvasBarrage');
    var barageIndex = 0;
    
    renderDanmu();
    setInterval(function() {
        renderDanmu();
    }, 7000);
    
    
    function renderDanmu() {
        var arr = dataBarrage.slice(barageIndex, barageIndex + 10);
        barageIndex += 10;
    
        if (barageIndex > 499) {
            barageIndex = 0;
        }
    
        arr.forEach(function(s) {
            barage.shoot(s);
        });
    }

yeah，搞定。但其实我在做的时候就知道，这么频繁的操作DOM，哪儿行啊。效果肯定也不是那么好。
但我也不知道为什么，就是要先写出来。显然，连我自己这关都过不了。

### CSS3

这时候不得不找CSS3大哥了。

    var barageIndex = 0;
    function cssBarrage() {
    
        renderDanmu();
        setInterval(function() {
            renderDanmu();
        }, 3500);
    
        function renderDanmu() {
            var arr = dataBarrage.slice(barageIndex, barageIndex + 12);
            barageIndex += 12;
    
            if (barageIndex > dataBarrage.length) {
                barageIndex = Math.floor(Math.random() * 100);
            }
    
            arr.forEach(function(s) {
                var div = '<div class="" style="color: ' + s.color + ';top: ' + (Math.floor(Math.random() * 700) + 10) + 'px;">' + s.value + '</div>';
                $('#canvasBarrage').append(div);
    
                var $one = $('#canvasBarrage div').last(),
                    cls = 'danmu-ani' + (1 + Math.floor(Math.random() * 13));
    
                $one.addClass(cls).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                    $one.remove();
                });
            });
        }
    }
    cssBarrage();

css3:

    .danmu-ani1 {
      -webkit-animation: danmu 10s linear 0s 1;
      animation: danmu 10s linear 0s 1;
    }
    
    .danmu-ani2 {
      -webkit-animation: danmu 14s linear 0s 1;
      animation: danmu 14s linear 0s 1;
    }
    
    .danmu-ani3 {
      -webkit-animation: danmu 7s linear 0s 1;
      animation: danmu 7s linear 0s 1;
    }
    
    .danmu-ani4 {
      -webkit-animation: danmu 18s linear 0s 1;
      animation: danmu 18s linear 0s 1;
    }
    
    .danmu-ani5 {
      -webkit-animation: danmu 11s linear 0s 1;
      animation: danmu 11s linear 0s 1;
    }
    
    .danmu-ani6 {
      -webkit-animation: danmu 12s linear 0s 1;
      animation: danmu 12s linear 0s 1;
    }
    
    .danmu-ani7 {
      -webkit-animation: danmu 13s linear 0s 1;
      animation: danmu 13s linear 0s 1;
    }
    
    .danmu-ani8 {
      -webkit-animation: danmu 15s linear 0s 1;
      animation: danmu 15s linear 0s 1;
    }
    
    .danmu-ani9 {
      -webkit-animation: danmu 11s linear 0s 1;
      animation: danmu 11s linear 0s 1;
    }
    
    .danmu-ani10 {
      -webkit-animation: danmu 13s linear 0s 1;
      animation: danmu 13s linear 0s 1;
    }
    
    .danmu-ani11 {
      -webkit-animation: danmu 16s linear 0s 1;
      animation: danmu 16s linear 0s 1;
    }
    
    .danmu-ani12 {
      -webkit-animation: danmu 11s linear 0s 1;
      animation: danmu 11s linear 0s 1;
    }
    
    .danmu-ani13 {
      -webkit-animation: danmu 13s linear 0s 1;
      animation: danmu 13s linear 0s 1;
    }
    
    @-webkit-keyframes danmu {
      from {
        visibility: visible; 
        -webkit-transform: translateX(1366px);
      }
      to { 
        visibility: visible; 
        -webkit-transform: translateX(-100%); 
      }
    }
    
    @keyframes danmu {
      from {
        visibility: visible; 
        transform: translateX(1366px);
      }
      to { 
        visibility: visible; 
        transform: translateX(-100%); 
      }
    }


### DEMO

[简易demo][3]

哈哈，总算解决了。再加些花边动画，背景再温馨些，中奖人弹出的效果再酷炫些。哟西。

通过GPU进行渲染，解放CPU果然很nice。但其实只要不频繁操作DOM就好多了。

  [1]: http://www.zhangxinxu.com/wordpress/2017/09/html5-canvas-video-barrage/
  [2]: http://taobaofed.org/blog/2016/02/22/canvas-performance/
  [3]: /demos/2018-02-11-wish-demo.html



