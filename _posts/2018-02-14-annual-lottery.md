---
layout:     post
title:      "双色球"
subtitle:   "年会娱乐项目"
description: "年会前端代码 前端特效 前端效果"
keyword:    "年会 canvas 前端"
date:       2018-02-14
author:     "xzavier"
catalog: true
tags:
    - Javascript
---

今天春节前最后一天了，坚守。接着上一茬儿。

今儿聊聊双色球抽奖。

这个挺好玩儿的，一个一个的数字摇出来，中奖桌平分奖池奖金，显然这个很刺激。

手机端不说了，就是一个选号的的页面，为了让年会方便简洁，我们没有设计用户体系。种cookie判断的，所以其实换个浏览器或者清理掉cookie就可以一人扮演多个用户了。但年会嘛，为了玩的轻松，设计直接扫码玩游戏，在做时间限制，简直比有个登录快捷多了。

还是说台上的LED抽奖页面，毕竟是出奖的页面。设计师设计的精美漂亮，但我写demo就把设计师的所有元素的略去了，哈哈。

从设计说起吧，双色球摇奖。就让球在一个容器里摇晃，摇晃可以用css3设计出球，然后不断地改变它的边距，看着就像它在运动。但在canvas也占据一片天地的今天，显然canvas设计会更加合理。

### 准备画布

    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    context.globalAlpha = 1;


我们要让双色球摇滚起来，就需要不断的在下一个位置重绘。所以每个球的颜色和值需要固定。不然一个球一会儿是红色，一会儿是蓝色，就有点对不起观众了。

    // 统一后续更新球的颜色值
    for (var z = 0; z < ballLen; z++) {
        colors[(z + 1) + ''] = z % 2 === 0 ? 'rgb(239, 60, 18)' : 'rgb(37, 110, 220)';
    }

每一次都新建一轮游戏，重置所有状态

### 初始化-状态重置

    function newRound() {
        isCurrGameStart = false;
        prizeTens = [];
        backendBonus = [];
        ballWinners = [];
        currentIndex = 0;
        canNextPress = false;
        currRoundBonusAppended = false;
    
        $('.bonus-ball').remove();
        getBonusNumAsync();
    
        var newNums = [];
        for (var n = 0; n < ballLen; n++) {
            newNums.push(n + 1);
        }
    
        nBalls = newNums.splice(0);
        kBalls = [];
        createKBalls();
    
        clearInterval(dtimer);
        clearInterval(ktimer);
        clearTimeout(stimer);
        clearTimeout(endtimer);
        canStatic = false;
    
        context.clearRect(0, 0, width, height);
        dropBalls();
    }

### 产生新的球球参数

    function createKBalls() {
        for (var i = 0; i < nBalls.length; i++) {
            var color = colors['' + nBalls[i]];
    
            var ball = {
                x: Math.random() * (width - 2 * ballRadius) + ballRadius,
                y: Math.random() * (height - 2 * ballRadius) + ballRadius,
                vx: Math.pow(-1, Math.ceil(Math.random() * 2)) * Math.random() * 4 + 6,
                vy: Math.pow(-1, Math.ceil(Math.random() * 2)) * Math.random() * 2 + 4,
                radius: ballRadius,
                color: color,
                number: nBalls[i]
            }
    
            kBalls[i] = ball;
        }
    }

### 画球

    // 画个球
    function draw(ball) {
        var grd = context.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, ball.radius);
        grd.addColorStop(0, '#eee');
        grd.addColorStop(1, ball.color);
        context.fillStyle = grd;
    
        context.beginPath();
        context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true);
        context.closePath();
    
        context.fill();
    
        context.fillStyle = '#fff';
        context.textAlign = 'center';
        context.font = 'bold 20px arial';
        context.fillText(ball.number, ball.x, ball.y + 8);
    }

然后循环把球都用上面的方法画出来：

    // 画球
    function drawBall() {
        context.clearRect(0, 0, width, height);
        for (var i = 0; i < kBalls.length; i++) {
            draw(kBalls[i]);
        }
    }

动画过程中，就是不断的画球，就需要不断的更新球的参数

### 不断更新球的位置

    // 更新球的位置
    function updateBall() {
        for (var i = 0; i < kBalls.length; i++) {
            var one = kBalls[i];
            one.x += one.vx;
            one.y += one.vy;
            if (one.x < one.radius || one.x > width - one.radius) {
                one.vx = -one.vx;
            }
            if (one.y < one.radius || one.y > height - one.radius) {
                one.vy = -one.vy;
            }
        }
    }

随机生成10个中奖号码，添加到DOM，准备动画

### 出奖动画

    function getBonusNumAsync() {
        var balls = []
        for (var i = 0; i < 30; i++) {
            balls.push(i + 1);
        }
        balls.sort(function() {
            return Math.random() - 0.5;
        });
        backendBonus = balls.slice(0, 10);
        appendBonusNum();
    }
    
    function appendBonusNum() {
        var tenBStr = '';
        for (var i = 0; i < backendBonus.length; i++) {
            var bColor = backendBonus[i] % 2 === 0 ? 'blue' : 'red';
            tenBStr += '<div class="bonus-ball ball-small' + (i + 1) + ' ' + bColor + '" style="display: none;">' + backendBonus[i] + '</div>';
        }
        $('.lotterry-box').append(tenBStr);
    }

### 保障观感真实性

每摇出一个球，就把盒子的球把要出的球减去，不再渲染此球

    function reduceBalls() {
        var currNum = backendBonus[currentIndex];
        prizeTens.push(currNum);
        downOneBall(currNum);
    
        currentIndex++;
    
        console.log('摇出第 ' + prizeTens.length + '个: ' + currNum);
    
        var newNums = []
        for (var n = 0; n < nBalls.length; n++) {
            if (nBalls[n] !== currNum) {
                newNums.push(nBalls[n]);
            }
        }
    
        nBalls = newNums.splice(0);
        kBalls = [];
        createKBalls();
    }


摇出的这个球，用相应的动画展示中奖号：

    function downOneBall(num) {
        var sColor = num % 2 === 0 ? 'small-blue' : 'small-red',
            bColor = num % 2 === 0 ? 'blue' : 'red';
    
        $('.ball-small').addClass(sColor).html(num).show().addClass('ball-ani').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $('.ball-small').removeClass('ball-ani small-blue small-red').html('').hide();
            $('.ball-small' + currentIndex).show();
            $('.ball-small' + currentIndex).addClass('ball-ani' + currentIndex);
        });
    }

### 定时摇出每个号码

一开始我们设计是enter一下，摇一个球，后来觉得操作频繁，容易失误，就还是循序摇奖。

    function autoDropLottery() {
        knockAnimate();
        autoTimer = setInterval(function() {
            if (prizeTens.length > 9) {
                isCurrGameStart = false;
                setNextPress();
                clearInterval(autoTimer);
                return;
            }
    
            knockAnimate();
        }, 3600);
    }

### 球球摇滚

    function knockAnimate() {
        clearInterval(dtimer);
        clearInterval(ktimer);
        clearTimeout(stimer);
        canStatic = false;
    
        context.clearRect(0, 0, width, height);
    
        if (isKnocking) {
            isKnocking = false;
            stop();
        } else {
            isKnocking = true;
            start();
        }
    }
    
    
    // 开始运动
    function start() {
        ktimer = setInterval(function() {
            drawBall();
    
            if (isKnocking) {
                updateBall();
            }
        }, 7);
    }
    
    // 停止运动并往下降
    function stop() {
        clearInterval(ktimer);
        context.clearRect(0, 0, width, height);
        reduceBalls();
        dropBalls();
    }

### 摇一个全部下落

摇一个球后需要所有球重力下降，才有真实感啊

    // 往下降
    function dropAnimate() {
        context.clearRect(0, 0, width, height);
        var t = 16 / 1000;
    
        collision(dBalls);
        dBalls.forEach(function(b) {
            b.drop(t);
        });
    
        if (canStatic) {
            mkstatic();
        }
    }
    
    // setInterval 模拟动画往下降
    function dropBalls() {
        // 清空之前的数据，重新画新球往下降
        dBalls = [];
        for (var i = 0; i < kBalls.length; i++) {
            var b = kBalls[i];
            var nb = new DBall(b.x, b.y, b.radius, b.vx, b.vy, b.color, b.number);
            dBalls.push(nb);
        }
    
        dtimer = setInterval(function() {
            dropAnimate();
        }, 8);
    
        stimer = setTimeout(function() {
            canStatic = true;
        }, 4000)
    }
    

### 下落的球做碰撞检测

    function collision(balls) {
        for (var i = 0; i < balls.length; i++) {
            for (var j = 0; j < balls.length; j++) {
                var b1 = balls[i],
                    b2 = balls[j];
                if (b1 !== b2) {
                    var rc = Math.sqrt(Math.pow(b1.x - b2.x, 2) + Math.pow(b1.y - b2.y, 2));
                    if (Math.ceil(rc) < (b1.radius + b2.radius + 2)) {
                        //获得碰撞后速度的增量
                        var ax = ((b1.vx - b2.vx) * Math.pow((b1.x - b2.x), 2) + (b1.vy - b2.vy) * (b1.x - b2.x) * (b1.y - b2.y)) / Math.pow(rc, 2);
                        var ay = ((b1.vy - b2.vy) * Math.pow((b1.y - b2.y), 2) + (b1.vx - b2.vx) * (b1.x - b2.x) + (b1.y - b2.y)) / Math.pow(rc, 2);
                        //给与小球新的速度
                        b1.vx = (b1.vx - ax) * collarg;
                        b1.vy = (b1.vy - ay) * collarg;
                        b2.vx = (b2.vx + ax) * collarg;
                        b2.vy = (b2.vy + ay) * collarg;
                        //获取两球斜切位置并且强制旋转
                        var clength = ((b1.radius + b2.radius + 2) - rc) / 2;
                        var cx = clength * (b1.x - b2.x) / rc;
                        var cy = clength * (b1.y - b2.y) / rc;
                        b1.x = b1.x + cx;
                        b1.y = b1.y + cy;
                        b2.x = b2.x - cx;
                        b2.y = b2.y - cy;
                    }
                }
            }
        }
    }

### 球球静止

当球到达地面后就应该慢慢静止了：

    // 下降过后一段时间不在重绘，使处于静态
    function mkstatic() {
        clearInterval(dtimer);
        clearInterval(ktimer);
        context.clearRect(0, 0, width, height);
        for (var i = 0; i < dBalls.length; i++) {
            draw(dBalls[i]);
        }
    }

之后就是不断的循环了。写了个demo，但只做了摇奖动画，其他元素都被窝略去了，对你有用的话，拿去随意增加。

### 拓展

可以更多拓展：

1、球球在摇滚过程中的碰撞检测，让球的运动轨迹发生改变。我这儿做的只是检测碰撞容器，球球之间状态独立。

2、现在容器只能是方形的，只能把容器隐藏，让用户感觉到是在一个椭圆形容器中。

3、优化。

### Demo

[摇奖demo][1]，进入页面，Enter开始摇奖，下键新一轮（摇奖中无效）


  [1]: /demos/2018-02-14-annual-lottery.html



