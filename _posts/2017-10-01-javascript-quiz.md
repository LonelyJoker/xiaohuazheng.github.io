---
layout:     post
title:      "来，做做这六个题"
subtitle:   "加深对JavaScript基础核心特性的理解"
date:       2017-10-01
author:     "xzavier"
catalog: true
tags:
    - Javascript
---

国庆第一天，谁去趟堵车这趟浑水啊，打打篮球，撩撩妹，写写代码，撩撩妹。

## 题目

 - 1、找出数字数组中最大的元素（使用Match.max函数）
 - 2、转化一个数字数组为function数组（每个function都弹出相应的数字）
 - 3、给object数组进行排序（排序条件是每个元素对象的属性个数）
 - 4、利用JavaScript打印出Fibonacci数（不使用全局变量）
 - 5、实现如下语法的功能：var a = (5).plus(3).minus(6); //2
 - 6、实现如下语法的功能：var a = add(2)(3)(4); //9

题目来源 [汤姆大叔手记][1]

## 练习

### 找出数字数组中最大的元素（使用Match.max函数）

应该是考察Apply和call等基础知识的掌握。

    function getMax(arr) {
        if (Array.isArray(arr) && arr.length) {
            return Math.max.apply(Math, arr);
        }
    
        return null;
    }

    getMax([1, 2, 3]); // 3

类似的还有：
    
    Math.max.apply
    Array.prototype.slice.call  
    Object.prototype.toString.call
    ......

### 转化一个数字数组为function数组（每个function都弹出相应的数字）

应该是考察闭包和函数表达式的使用。

    function printFuncArr(arr) {    
        for(var i = 0, len = arr.length; i < len; i++) {
            arr[i] = function(j) {
                return (function() {
                    console.log('value: ' + j);
                })();
            }(arr[i]);
        }
    }
    printFuncArr([7, 6, 5, 4, 3, 2, 1]);

### 给object数组进行排序（排序条件是每个元素对象的属性个数）

应该是考察对象属性的灵活使用，至于排序你可以有很多种想法。

    function getKeyLen(obj){
        var n = 0;
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                n++;
            }
        }
        return n;
    }
    // 获取长度有很多方法，比如:
    // Object.keys(obj);
    // Object.getOwnPropertyNames(obj).length;
    
    function sortObjArr(arr) {
        return arr.sort(function (a, b) {
            var a = getKeyLen(a),
                b = getKeyLen(b);
            return a - b;
        });
    }
    
    var objArr = [{
        c: 3,
        d: 4,
        e: 5
    }, {
        a: 1,
        b: 2
    }, {
        o: 0,
    }, {
        j: 10,
        k: 11,
        l: 12,
        m: 13,
        n: 14
    }, {
        f: 6,
        g: 7,
        h: 8,
        i: 9
    }];
    
    sortObjArr(objArr);

### 利用JavaScript打印出Fibonacci数（不使用全局变量）

应该是考察对闭包（不使用全局变量我就想到了闭包）及自执行函数。

    function printFibonacci(n) {
        var arr = [];
        for(var i = 1; i <= n; i++){
            arr.push((function(ii){return ii < 3 ? 1 : arguments.callee(ii - 1) + arguments.callee(ii - 2);})(i));
        }
        
        console.log(arr);
    }
    
    printFibonacci(5); // [1, 1, 2, 3, 5]

### 实现如下语法的功能：var a = (5).plus(3).minus(6); // 2

应该是考察给数据类型的原型添加方法，加深对原型的理解。

    Number.prototype.plus = function (n) {
        return this + n;
    }

    Number.prototype.minus = function (n) {
        return this - n;
    }
     
    (5).plus(3).minus(6); // 2

### 实现如下语法的功能：var a = add(2)(3)(4); // 9

    function add(a) {
        return function (b) {
            return function (c) {
                return a + b + c;
            }
        }
     
    }
    
    add(2)(3)(4);  // 9

看到评论里的如果不止是 `add(2)(3)(4); ` 的话，是加n个，就利用toString和valueOf方法实现：

    function add(num) {
        var res = num;
        var fn = function(num) {
            res += num;
            return fn;
        }
        fn.toString = fn.valueOf = function() {
            return res;
        }
        
        return fn;
    }
    
    add(1)(2)(3)(4) + 5;  // 15



  [1]: http://www.cnblogs.com/TomXu/archive/2012/02/10/2342098.html#!comments