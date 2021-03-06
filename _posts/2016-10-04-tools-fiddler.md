---
layout:     post
title:      "工具系列（3）-Fiddler"
subtitle:   "http协议调试代理工具 - 手机代理调试基本配置和使用"
description: "Fiddler 调试 代理 "
keyword:    "Fiddler 调试 代理 "
date:       2016-10-04
author:     "xzavier"
catalog: true
tags:
    - HTTP
---



## Fiddler

Fiddler是一个http协议调试代理工具，它能够记录并检查所有你的电脑和互联网之间的http通讯，设置断点，查看所有的“进出”Fiddler的数据（指cookie,html,js,css等文件，这些都可以让你胡乱修改的意思）。

反正就是方便开发调试，mock接口数据。

## 安装

百度Google下载安装，不花钱。

## 配置

当你安装好了，看到界面，哇，其实fiddler好多界面交互，不过，对于简单使用的你而言，无需关心。

打开Tools -> Fiddler Options... -> Connections 看一下fiddler监听的端口，配置手机代理的时候使用，你可以改，但不要监听不被允许的端口就行。

![图片描述][1]

### 其他选项

其他选项General, HTPPS的这个可以勾, 因为fiddler默认只抓取http格式的。

![图片描述][2]

### ipconfig

之后就是安装手机证书：

查看ip地址，windows + R -> 键入 ipconfig ，查货ipv4的值。

## 安装证书

保障你的手机和fiddler服务在同一局域网下，就连接同一wifi，打开手机浏览器，输入：

“机器ipv4的值”：“刚刚我们在fiddler里设置查看的端口号”发起请求。如图：

![图片描述][3]

### 证书

点击下载证书

![图片描述][4]

### 密码

要输入密码就随意输入一个你喜欢的，然后取个名字，就OK了。

![图片描述][5]

## 手机连接

打开wifi设置的地方，找到设置代理的地方，各手机操作姿势不一样，感觉苹果的很简单显而易见，有些手机需要:长按wifi名 -> 修改 -> 高级 ->
这个就自己玩儿，手动代理即可。

![图片描述][6]

### 输入

之后输入我们的ip和端口号，确定保存，然后连接好wifi

![图片描述][7]

## 实验 

连接好之后手机随意发个请求打开个网页，就能在fiddler上看到一系列请求的参数数据了。

你可能主要喜欢看这些：

各种查询参数，header，cookie，页面html，接口返回值，大概都是你在开发调试时需要查看的吧。

![图片描述][8]

![图片描述][9]

更多数据查看就需要自己去探索了。

## 数据mock

我们在开发中，经常会造假数据进行测试，fiddler就可以拦截请求，然后自己造数据进行测试:

选中一个你想mock数据的api链接，然后addRUle

![图片描述][10]

### 文件

选择一个你存放mock数据的文件，如果是json格式的话，必须是严格格式，否则请求会走到error分支。

![图片描述][11]

### 更多

如果你没开发了在玩手机的时候，发现有什么不对劲儿，大概就是代理导致的，去把它关掉吧。

就到这儿吧，这是Fiddler简单配置和使用，里面的很多功能需要你实际的去使用：[可以看看这个][12]

  [1]: https://raw.githubusercontent.com/xiaohuazheng/twbm/master/articles/img/fiddler/1.png
  [2]: https://raw.githubusercontent.com/xiaohuazheng/twbm/master/articles/img/fiddler/2.png
  [3]: https://raw.githubusercontent.com/xiaohuazheng/twbm/master/articles/img/fiddler/3.jpg
  [4]: https://raw.githubusercontent.com/xiaohuazheng/twbm/master/articles/img/fiddler/4.jpg
  [5]: https://raw.githubusercontent.com/xiaohuazheng/twbm/master/articles/img/fiddler/5.jpg
  [6]: https://raw.githubusercontent.com/xiaohuazheng/twbm/master/articles/img/fiddler/6.jpg
  [7]: https://raw.githubusercontent.com/xiaohuazheng/twbm/master/articles/img/fiddler/7.jpg
  [8]: https://raw.githubusercontent.com/xiaohuazheng/twbm/master/articles/img/fiddler/8.jpg
  [9]: https://raw.githubusercontent.com/xiaohuazheng/twbm/master/articles/img/fiddler/9.jpg
  [10]: https://raw.githubusercontent.com/xiaohuazheng/twbm/master/articles/img/fiddler/10.png
  [11]: https://raw.githubusercontent.com/xiaohuazheng/twbm/master/articles/img/fiddler/11.jpg
  [12]: http://blog.csdn.net/qq_21445563/article/details/51017605


