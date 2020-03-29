---
layout:     post
title:      "AMP初探"
subtitle:   "Hello , Accelerated Mobile Page"
description: "AMP学习 实践"
keyword:    "AMP"
date:       2017-12-06
author:     "xzavier"
catalog: true
tags:
    - Javascript
    - HTML5
---

AMP已经出来很久了，最近看到官方说12月会在北京上海有路演，才想起自己好久没接触这个AMP了，之前为了试一试，把自己博客的about页面改成了AMP页面，当时还在上线前后用了google developer toos - pagespeed 测了下速，确实快了许多，个人感觉还是有速度的提升。但是不知道咋地就是还没看到市场上火起来，大概是它暂时局限于内容页面。好了，现在又有roadshow了，那我也又来尝尝这口粥。

[RoadShow][1]

# AMP - Wht ?

![AMP LOGO][10]

AMP 的全称是 Accelerated Mobile Page，可以理解成加速的移动平台网页。它指的是采用特定的开发技术和规范，让您的网页在手机等移动平台上能更加高速运行和显示，给您的客户提供更好的用户体验。这个开源的和开放型技术现在受到了互联网业界的极大关注，全球的很多公司开始在更新他们的网站开发，使用 AMP 技术增强他们的网站的运行速度和跨平台支持，让他们的网页在众多移动设备上更好地展现。

这是我最粗略的介绍。[官方介绍-英][2] & [官方介绍-中][3]

[官方网站-英][4] & [官方网站-中][5]

# AMP - Why ?

- 1、利益受到了威胁
- 2、赚取更多的利益
- 3、为了用户
- 4、新的东西挺好玩儿

哈哈，随意介绍了三点原因，看看市场上的人都怎么说。

1、利益受到了威胁。流量为王的时代，Google发现自己的饼被人一点一点的啃着，我靠，如何能忍。再看到流量一点一滴的网Facebook和苹果新闻应用等产品流时，坐不住了，于是便有了Accelerated Mobile Pages（AMP）应战。

2、如果在移动端一个页面3秒钟还没有完成加载，那么有90%以上的访问者会关掉网页或者访问其他网页。所以，你能让这样的流量跑掉嘛？花花的银子啊。

3、为了用户。随着网络的发展，移动web已经占领着大片市场，但移动web的性能却赶不上桌面web和移动app，越来越多的人抱怨移动web的性能网络的网速太慢。话不多说，为了用户，AMP就出生了。

4、Google作为行业巨头，探索些标志性的造福人类的东西，自然为之。

# AMP - Now ?

AMP目前的使用者，应该局限于大型的新闻网站，或者内容网站，例如博客。WordPress就支持AMP。

另外，谷歌也宣布了百度、搜狗、雅虎日本的搜索结果将会与“Accelerated Mobile Pages”(AMP，加速移动页面)直接对接，也就是说上述三大搜索引擎将会支持AMP。要知道，百度、搜狗在中国的搜索市场占有率，想想，PC有百度，移动有搜狗，应该说市场还是挺起来了。

# AMP - More ?

我今儿就不写什么原理了，比如：

- [AMP 的运作原理][6]
- [AMP 设计原则][7]
- [AMP 文档][8]
- [AMP 指南][9]

这些需要的童鞋前往网址或官方网站就可以自行查看了，后面再慢慢的推一些实践文章。
不过，自己从教程一步一步的来，就可以写出个简单的demo页面了。

# AMP - Diff ?

闪电是AMP页面的标志:

![AMP LOGO][10]

再装个AMP 检测Chrome插件： AMP Validator：

![AMP Validator][20]

如果不是AMP页面，图标就是灰的。
如果是AMP页面且符合规范，就是绿色的，如果不符合规范，只是警告的红色。

装上这个插件后，随意打开个页面，应该就是灰色的，也阔以打开我的博客关于我页面，应该就是绿色的。

也阔以打开调试工具，查看elements，第一行长这样：

    <!doctype html>
    <html ⚡ lang="zh_CN" amp-version="1510956201635" class="i-amphtml-singledoc i-amphtml-standalone" style="padding-top: 0px;">

在设计AMP html时头部也是这么写的：

    <!doctype html>
    <html ⚡>

或者：

    <!doctype html>
    <html amp>



这些元素 AMP Page 必备：

- 以文档类型 <!doctype html> 开头
- 包含顶级 <html ⚡> 标记（也接受 <html amp>）
- 包含 <head> 和 <body> 标记（这些标记在 HTML 中是可选的）
- 在<head>内包含一个 <link rel="canonical" href="$SOME_URL"> 标记，该标记指向 AMP - HTML 文档的常规 HTML 版本，或在此类 HTML 版本不存在的情况下指向文档本身
- 包含 <meta charset="utf-8"> 标记作为<head>标记的第一个子项
- 在<head>标记内包含 <meta name="viewport" content="width=device-width,minimum-scale=1"> 标记。还建议包括 initial-scale=1
- 包含 <script async src="https://cdn.ampproject.org/v0.js"></script> 标记作为<head>中的最后一个元素（这样做将会包括并加载 AMP JS 库）
- 在其 <head> 标记内包含以下内容： 

```<style amp-boilerplate>
        body{
            -webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;
            -moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;
            -ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;
            animation:-amp-start 8s steps(1,end) 0s 1 normal both;
        }
        @-webkit-keyframes -amp-start{
            from{visibility:hidden}
            to{visibility:visible}
        }
        @-moz-keyframes -amp-start{
            from{visibility:hidden}
            to{visibility:visible}
        }
        @-ms-keyframes -amp-start{
            from{visibility:hidden}
            to{visibility:visible}
        }
        @-o-keyframes -amp-start{
            from{visibility:hidden}
            to{visibility:visible}
        }
        @keyframes -amp-start{
            from{visibility:hidden}
            to{visibility:visible}
       }
    </style>
    <noscript><style amp-boilerplate>
        body{
            -webkit-animation:none;
            -moz-animation:none;
            -ms-animation:none;animation:none
        }
    </style></noscript>```


完整的demo可以查看
[My AMP Page][11]，或者官方的 [Learn AMP by Example][12]

嗯，这次我就写到这里，没有满足胃口我很抱歉，今天就简单介绍下AMP，以及AMP Page长啥样。

如果手头这个wap项目要改用AMP HTML，那我就能好好的折腾，写点博客了。

有时间咱就一起玩玩吧~



  [1]: https://www.ampproject.org/amp-roadshow/
  [2]: https://www.ampproject.org/learn/overview/
  [3]: https://www.ampproject.org/zh_cn/learn/overview/
  [4]: https://www.ampproject.org/
  [5]: https://www.ampproject.org/zh_cn/
  [6]: https://www.ampproject.org/zh_cn/learn/about-how/
  [7]: https://www.ampproject.org/zh_cn/learn/amp-design-principles/
  [8]: https://www.ampproject.org/zh_cn/docs/tutorials/create
  [9]: https://www.ampproject.org/zh_cn/docs/guides/responsive_amp
  [10]: https://www.ampproject.org/static/img/logo-og-image.jpg
  [11]: https://xiaohuazheng.github.io/about/
  [12]: https://ampbyexample.com/
  [20]: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADJklEQVRogcWav2sUQRzFP3eBYAIGDwTRgJVCFKxEIyqIhW380QgqJI1nIdqLQQX9EySCnaDYRNRCArEQBIUktkrkUupZGNEzHOfPrMXMxXXdze7MvLs8+Ba5y773Zu47u9/5zpbQoA84AhwGhoBtQAVYb79fAj4DC8A88Ax4CrRE+l6oAKPAQ6AJRI7RtNeOWq6uoR8YBxoeprOiAVy23B1DD1AF6kLjyagDZ62WFIPAXAeNJ2PWakowTGdnfbVfY2+o+TOYO0WomSdACRhwvK4FnA4xr5jJJWCr5dztyeE8iGE0Mx8BF2O8Jz05Wjik0yC6nJ8ByjHu8QCuOgUWdg+6u80PYFeC/04g5yw5t9iqyHwE3EjhfyngrWaZ70eXOm+BdSkaHwXcdTKe2CH5GY9l4FAK/wYRf4QpO/5BBV1tczttdoA9wgE0SBSAYyLiD3am03BKOIDIel65xR3NEHXFBeBLxnfbRRptrHjuw6+eT8bjHMG7Ao14NK13RgRkDfIfMjPiAUTASBmzDQzFJeB9zv+oUwis9ynCZuEFptLMQykj4jjuqD0FUAsw/x3YWcB8EQxgfkUX/RrAYsAAronMA9zy0F8EM4s+5t8AvSLzBzBPcJ8M8BrAshVVoBczGb4p7JVCEyLzAFc9za+kkOsifodZcArswD+FI6BWxrT7XHAe+CowX8IUfiHraKGM6VW6YBL4Cfyy8dvGMn8X4qcCPOeAg47aScyDppRIxkyO8BZM0ReqMwK6Yi4e93IG8ECg0QT6ypiWxXSOoCtWW1fHgBMCjWmg1d4P5JXCrqhlfD4A3BRpPIr/UcHcWVQptC9DdELE/9+WEnSb+gjYmGJ+P37lQlqMp82Oqq2StqXsBV6LzGe2VUDT2HqVwntFZD5ilcYWaFqL9xOcQ8A3kfk5CpzehDZ3r8e4SsBzkflCzd02QtrrozEeVa+1ZT05wfeAo71P2IymXIisFy/4HDFtstdOCoy3Qsy3sZaHfM5pk4VuH7POITxmbaNbB91VOnDQHUf7VQNl7dSwnB191SCJCqbFHfqyxxgBL3sUaQkWwZq9bvMH93wQcSHH2SgAAAAASUVORK5CYII=



