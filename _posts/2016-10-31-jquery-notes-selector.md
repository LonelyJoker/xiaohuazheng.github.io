---
layout:     post
title:      "jQuery笔记（1）"
subtitle:   "选择器"
date:       2016-10-31
author:     "xzavier"
header-img: "img/posts/jquery-bg.jpg"
catalog: true
tags:
    - jQuery
    - jQuery笔记
---

# jQuery-选择器浅析
jQuery 最核心的组成部分就是：选择器引擎，选择器引擎Sizzle占了jQuery很大一部分。它继承了CSS 的语法，可以对DOM 元素的标签名、属性名、状态等进行快速准确的选择，并且不必担心浏览器的兼容性。jQuery选择器实现了CSS1~CSS3 的大部分规则之外，还实现了一些自定义的选择器，用于各种特殊状态的选择。

### 基础选择器

    选择类型           选择器                  返回  
    元素名         $('div')            获取所有div元素的DOM对象
    ID            $('#xzavier')       获取一个ID为box元素的DOM对象
    类(class)     $('.xzavier')       获取所有class为box的所有DOM对象
    群组选择       $('span,.xzavier')  获取多个选择器的DOM对象
    后代选择       $('ul li a')        获取追溯到的多个DOM对象
    通配选择       $('*')              获取所有元素标签的DOM对象
    后代选择       $('ul li a')        获取追溯到的多个DOM对象
    子选择         $('div p')          只获取子类节点的多个DOM对象
    next选择       $('div + p')        只获取某节点后一个同级DOM对象
    nextAll选择    $('div ~ p')        获取某节点后面所有同级DOM对象
    
    $('#xzavier').find('button')      //等价后代选择器
    $('#xzavier').children('button')  //等价子选择器
    $('#xzavier').next('button')      //等价next选择器 
    $('#xzavier').nextAll('button')   //等价nextAll选择器    
    $('#xzavier').prev('button')      //选择同级上一个元素
    $('#xzavier').prevAll('button')   //选择同级所有上面的元素
    $('#xzavier').prevUntil('button') //选择同级上非指定元素，遇到则停止
    $('#xzavier').nextUntil('button') //选择同级下非指定元素，遇到则停止
    $('#xzavier').siblings('button')  //选择同级上下所有元素

更多：

    1.ID返回的是单个元素，而元素标签名和类(class)返回的是多个，我们可以采用jQuery 核心自带的一个属性length 或size()方法来查看返回的元素个数。    
    2.ID在页面中是唯一的，一般要求开发者要遵守规范。如果你在页面中出现三次，在CSS使用样式是会成功显示样式的，但在jQuery，就匹配不到后面的ID。
    3.在使用上，通配选择器一般用的并不多，尤其是*，比如：$('*')，这种使用方法效率很低，影响性能。 
    4.在构造选择器时，尽量简单，只保证必要的确定性。当选择器筛选越复杂，jQuery 内部的选器引擎处理字符串的时间就越长。 
    5.注意，find()、next()、nextAll()和children()这四个方法中，如果不传递参数，就相当于传递了“*”，即任何节点。

### 属性选择器

    对应CSS模式               选择器                            返回
    a[title]           $('a[title]')             获取title属性的DOM对象
    a[title=num]       $('a[title=num]')         获取title属性且=num的DOM对象
    a[title^=num]      $('a[title^=num]')        获取title且开头属性值匹配的DOM对象
    a[title|=num]      $('a[title|=num]')        获取title且=num或开头属性值匹配后面跟一个“-”号的DOM对象
    a[title$=num]      $('a[title$=num]')        获取title属性且结尾属性值匹配的DOM对象
    a[title!=num]      $('a[title!=num]')        获取title属性且!=num的DOM对象
    a[title~=num]      $('a[title~=num]')        获取title且属性值是以一个空格分割的列表，其中包含属性值的DOM对象
    a[title*=num]      $('a[title*=num]')        获取title且属性值含有一个指定字串的DOM对象
    a[xz][title=num]   $('a[xz][title=num]')     获取具有bbb属性且title属性=num的DOM对象

### 过滤选择器

#### 基本过滤选择器

    过滤器名          jQuery              返回       
    :first         $('li:first')     选取第一个元素     
    :last          $('li:last')      选取最后一个元素   
    :not(selector) $('li:not(.xzavier)') 选取class不是xzavier的li元素
    :even          $('li.even')      选择索引(0 开始)是偶数的所有元素
    :odd           $('li:odd')       选择索引(0 开始)是奇数的所有元素
    :eq(index)     $('li:eq(2)')     选择索引(0 开始)等于index的元素
    :gt(index)     $('li:gt(2)')     选择索引(0 开始)大于index的元素
    :lt(index)     $('li.lt(2)')     选择索引(0 开始)小于index的元素
    :header        $(':header')      选择标题元素，h1 ~ h6 
    :animated      $(':animated')    选择正在执行动画的元素
    :focus         $(':focus')       选择当前被焦点的元素

更多：

    1.:focus 过滤器，必须是网页初始状态的已经被激活焦点的元素才能实现元素获取。而不是鼠标点击或者Tab键盘敲击激活的。
    2.:first、:last 和first()、last()这两组过滤器和方法在出现相同元素的时候，first 会实现第一个父元素的第一个子元素，last 会实现最后一个父元素的最后一个子元素。所以，如果需要明确是哪个父元素。

#### 内容过滤器

    过滤器名                jQuery                        返回
    :contains(text)  $(':contains("xzavier")')  选取含有"xzavier"文本的元素
    :empty           $(':empty')                选取不包含子元素或空文本的元素
    :has(selector)   $(':has(.xzavier)')        选取含有class是xzavier的元素
    :parent          $(':parent')               选取含有子元素或文本的元素

更多：

    1.jQuery 提供了一个has()方法来提高:has 过滤器的性能：$('ul').has('.xzavier')
    2.jQuery 提供了一个名称和:parent 相似的方法，但这个方法并不是选取含有子元素或文本的元素，而是获取当前元素的父元素，返回的是元素集合

#### 可见性过滤器

    过滤器名      jQuery            返回
    :hidden    $(':hidden')    选取所有不可见元素集合元素
    :visible   $(':visible')   选取所有可见元素集合元素

更多：

    1.:hidden 过滤器一般是包含的内容为：CSS 样式为display:none、input 表单类型为type="hidden"和visibility:hidden 的元素

#### 子元素过滤器

    过滤器名             jQuery                   返回
    :first-child   $('li:first-child')   获取每个父元素的第一个子元素
    :last-child    $('li:last-child')    获取每个父元素的最后一个子元素
    :only-child    $('li:only-child')    获取只有一个子元素的元素
    :nth-child(odd/even/eq(index))  $('li:nth-child(even)')    获取每个自定义子元素的元素(索引值从1开始计算)

#### 过滤方法

    方法名                 jQuery                               备注
    is(s/o/q/f)       $('li').is('.red')           参数可传递选择器、DOM、jquery对象或是函数来匹配
    hasClass(class)   $('li').hasClass('xzavier')  同is("." + class)
    slice(start, end) $('li').slice(0,2)           选择从start到end位置的元素，如果是负数，则从后面开始
    filter(s/o/q/f)   $('li').filter('.xzavier')   参数可传递选择器、DOM、jquery对象或是函数来匹配
    end()             $('div').find('p').end()     获取当前元素前一次状态集合元素
    contents()        $('div').contents()          获取某元素下面所有元素节点，包括文本节点

### 表单元素选择器

    选择器名         jQuery               返回
    :input     $(":input")     所有 <input> 元素
    :text       $(":text")      所有 type="text" 的 <input> 元素
    :password   $(":password")  所有 type="password" 的 <input> 元素
    :radio     $(":radio")     所有 type="radio" 的 <input> 元素
    :checkbox   $(":checkbox")  所有 type="checkbox" 的 <input> 元素
    :submit   $(":submit")    所有 type="submit" 的 <input> 元素
    :reset     $(":reset")     所有 type="reset" 的 <input> 元素
    :button   $(":button")    所有 type="button" 的 <input> 元素
    :image     $(":image")     所有 type="image" 的 <input> 元素
    :file       $(":file")      所有 type="file" 的 <input> 元素      
    :enabled     $(":enabled")   所有激活的 input 元素
    :disabled   $(":disabled")  所有禁用的 input 元素
    :selected   $(":selected")  所有被选取的 input 元素
    :checked     $(":checked")   所有被选中的 input 元素

更多：

    1.这些选择器都是返回元素集合，如果想获取某一个指定的元素，最好结合一下属性选择器。
    $(':text[name=xzavier]); //获取单行文本框name=xzavier 的元素  

我们在使用中，不会所有标签都有id，使用起来也不方便，代码冗杂。综合组合很多选择器使用，选到特定的元素，也是非常方便的。   

