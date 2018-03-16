---
layout:     post
title:      "互动剧"
subtitle:   "年会娱乐项目"
date:       2018-02-12
author:     "xzavier"
catalog: true
tags:
    - Javascript
---

继续上一茬儿。

今儿说说互动剧。

这个挺好玩儿的，我们也是主要借鉴这个效果：[浏览器手机模式or手机端查看效果][1]

先说说手机端，我们不是一次性点击就进入下一场景，而是一个投票时间段，同事们可以不断的点击自己想要的剧情走向，再根据算法增加这个剧情分支的热度。倒计时结束后，剧情网分支热度最高的方向走。这样才完全调起了观众们不断点击自己喜爱的按钮的激情，当时看到临桌疯狂的点击并呐喊的时候，我简直开心到爆。

点击效果：

    var meteors = new mojs.Burst({
            radius: {
                0: 200
            },
            count: 7,
            angle: {
                0: 120
            },
            opacity: {
                1: 0
            },
            left: 0,
            top: 0,
            children: {
                fill: ['#06dfff'],
                stroke: '#06dfff'
            }
    
        });
        
        // 解决mojs在我使用中遇到的显示问题
        $('[data-name="mojs-shape"]').css('z-index', 10000);
    
        $('.vote-btn-list li').on('touchstart', function(e) {
            if (!canVote) {
                return;
            }
            
            // 不断+1效果
            $(this).append('<i class="add-effect">+1</i>');
    
            var $add = $(this).find('.add-effect').last();
            $add.addClass('add-one').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                $add.remove();
            });
            
            // 点击按弧度洒滴效果
            var _touch = e.originalEvent.targetTouches[0];
            meteors
                .tune({
                    x: _touch.pageX,
                    y: _touch.pageY
                })
                .replay();
        });


这上面的svg效果还是非常赞的： [mojs][2]

LED互动剧：
主要还是swiper切屏，在需要操作的页面判断使用Enter键操作。

至于剧情分支热度柱形图，我就用定时器不断的增加高度，当然，为了起伏效果，设置了多个定时器，并可以配置一定时间内增长的速度和热度值。

    // 定时器
    var timer_vote_win_1 = null,
        timer_vote_win_2 = null,
        timer_vote_win_3 = null;
     
    var timer_vote_fail_1 = null,
        timer_vote_fail_2 = null,
        timer_vote_fail_3 = null;
    
    var timer_count_down = null;
    
    
    // setInterval 设置bar高度，参数取配置
    function setRoundBar(key) {
    
        setTimeout(function() {
            setCountDwon(key);
        }, 18000);
    
        timer_vote_win_1 = setInterval(function() {
            setWinHeight(key);
    
            if (winNumber[key] > winSteps[key][0][1]) {
                clearInterval(timer_vote_win_1);
                timer_vote_win_2 = setInterval(function() {
                    setWinHeight(key);
    
                    if (winNumber[key] > winSteps[key][1][1]) {
                        clearInterval(timer_vote_win_2);
    
                        timer_vote_win_3 = setInterval(function() {
                            setWinHeight(key);
    
                            if (winNumber[key] > winSteps[key][2][1]) {
                                clearInterval(timer_vote_win_3);
                            }
                        }, Math.ceil(winSteps[key][2][0] / (winSteps[key][2][1] - winSteps[key][1][1])));
                    }
                }, Math.ceil(winSteps[key][1][0] / (winSteps[key][1][1] - winSteps[key][0][1])));
            }
        }, Math.ceil(winSteps[key][0][0] / winSteps[key][0][1]));
    
        timer_vote_fail_1 = setInterval(function() {
            setFailHeight(key);
    
            if (failNumber[key] > failSteps[key][0][1]) {
                clearInterval(timer_vote_fail_1);
                timer_vote_fail_2 = setInterval(function() {
                    setFailHeight(key);
    
                    if (failNumber[key] > failSteps[key][1][1]) {
                        clearInterval(timer_vote_fail_2);
    
                        timer_vote_fail_3 = setInterval(function() {
                            setFailHeight(key);
    
                            if (failNumber[key] > failSteps[key][2][1]) {
                                clearInterval(timer_vote_fail_3);
                            }
                        }, Math.ceil(failSteps[key][2][0] / (failSteps[key][2][1] - failSteps[key][1][1])));
                    }
                }, Math.ceil(failSteps[key][1][0] / (failSteps[key][1][1] - failSteps[key][0][1])));
            }
        }, Math.ceil(failSteps[key][0][0] / failSteps[key][0][1]));
    }
    
    // 设置win bar height
    function setWinHeight (key) {
        winNumber[key] += 1;
        winHeight[key] += 1;
        winBar[key].css('height', winHeight[key] + 'px');
        winSapn[key].html(winNumber[key]);
    }
    
    // 设置fail bar height
    function setFailHeight (key) {
        failNumber[key] += 1;
        failHeight[key] += 1;
        failBar[key].css('height', failHeight[key] + 'px');
        failSpan[key].html(failNumber[key]);
    }
    
    // 10s增长倒计时
    function setCountDwon(key) {
        var time = 10;
        timer_count_down = setInterval(function() {
            var preCls = 'countdown-box' + (time + 1) + ' pulse',
                curCls = 'countdown-box' + time + ' pulse';
    
            time--;
            if (time < 0) {
                clearInterval(timer_count_down);
    
                clearInterval(timer_vote_win_3);
                clearInterval(timer_vote_fail_3);
                clearInterval(timer_vote_win_2);
                clearInterval(timer_vote_fail_2);
                clearInterval(timer_vote_win_1);
                clearInterval(timer_vote_fail_1);
    
                setDramaConf();  // 通知后端
                return;
            }
            
            // 从10开始动画，依次减1
            countDowns[key].addClass(curCls).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                countDowns[key].removeClass(curCls);
            });
        }, 1100);   
    }

这样就达到预期的效果了，哈哈，显然，导演这个设计very棒！



  [1]: http://jxqy.qq.com/act/a20171027h5/?from=timeline
  [2]: http://mojs.io/tutorials/burst/



