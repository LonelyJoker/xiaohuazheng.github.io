---
layout:     post
title:      "漂亮的滚动条"
subtitle:   "自定义滚动条样式"
description: "自定义滚动条样式 美化滚动条"
keyword:    "浏览器滚动条 滚动条美化 -webkit-scrollbar -webkit-scrollbar-track -webkit-scrollbar-thumb"
date:       2018-04-13
author:     "xzavier"
catalog: true
tags:
    - Javascript
---

滚动条，再熟悉不过的东西了。
只要内容超过屏幕，滚动的时候就会出现在侧边的滚动条，有时候，他真的好丑，粗粗的黑黑的，像被生活磋磨了数百次，不再温柔。

平时写个内容框，内容超出的是也可能需要在狭窄的空间内滚动内容，虽然丝滑，但那黑粗的滚动条，确实吸引了视线，内容怎能人黑粗长的东西吸引了读者的目光。那我们帮帮她吧：

### 添加样式

    .beautiful-scroll-bar-box {
        height: 800px;
        overflow-y: auto;
        &::-webkit-scrollbar-track{
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.01);
            border-radius: 10px;
            background-color: #ebebeb;
        }
        &::-webkit-scrollbar{
            width: 6px;
            border-radius: 10px;
            background-color: #ebebeb;
        }
        &::-webkit-scrollbar-thumb{
            width: 8px;
            border-radius: 10px;
            background-color: #d9d9d9;
        }
    }

给有需要scoll的盒子添加以上样式，我们就给补了个淡妆。淡妆，总相宜。


