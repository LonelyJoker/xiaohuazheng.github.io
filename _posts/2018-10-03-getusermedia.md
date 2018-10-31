---
layout:     post
title:      "捕获用户麦克风 && 摄像头"
subtitle:   "Capturing Audio && Video"
date:       2018-10-03
author:     "xzavier"
catalog: true
tags:
    - Javascript
---



### Use It

#### 捕获麦克风

控制台输入下面代码实现麦克风捕获，戴上耳机，就可以听到你说话的声音了：

    const aconstraints = { audio: true};
    
    navigator.mediaDevices.getUserMedia(aconstraints)
    .then(function(mediaStream) {
        const audio = document.createElement('audio');
        audio.srcObject = mediaStream;
        audio.onloadedmetadata = function(e) {
            audio.play();
        };
    })
    .catch(function(err) {
        console.log(err.name + ": " + err.message);
    });

捕获了音频用`audio`元素播放出来，也可以使用 Web Audio API `AudioContext` 播放。把下面这段代码复制到控制台也阔以实现捕获麦克风并播放。

    window.AudioContext = window.AudioContext ||window.webkitAudioContext;
    
    const context = new AudioContext();
    
    navigator.mediaDevices.getUserMedia({
        audio: true
    }).
    then((stream) => {
        const microphone = context.createMediaStreamSource(stream);
        const filter = context.createBiquadFilter();
        // microphone -> filter -> destination
        microphone.connect(filter);
        filter.connect(context.destination);
    });


#### 捕获摄像头

控制台输入下面代码实现捕获摄像头：

    const vconstraints = { video: true };
    let localMediaStream;
    
    navigator.mediaDevices.getUserMedia(vconstraints)
    .then(function(mediaStream) {
        localMediaStream = mediaStream;
    
        var video = document.createElement('video');
        document.body.appendChild(video);
        video.srcObject = mediaStream;
        video.onloadedmetadata = function(e) {
            video.play();
        };
    })
    .catch(function(err) {
        console.log(err.name + ": " + err.message);
    });

MediaStream 接口是一个媒体内容的流.。一个流包含几个轨道，比如视频和音频轨道。
使用的时候在不断的使用摄像头并占用资源，所以在不使用的时候需要停掉：

    localMediaStream.getTracks()[0].stop();

这是只开了一个track的情况，video和audio都开的情况需要遍历stop，或者指定stop.

为了安全，以上代码需要在`https 、 localhost 、file://` 的URL环境下才能只能生效。否则抛错：

    DOMException: Only secure origins are allowed

但其实，在https页面中打开一个包含此代码的页面，询问了一次用户并同意后，后面就不会再询问用户了。


### Learn

在`navigator.mediaDevices.getUserMedia`之前，我们使用的是`navigator.getUserMedia`，后被废弃。但这个已废弃的API版本为了向后兼容还存在着。因为该特性已经从 Web 标准中删除，也许在未来的某个时间就停止支持，所以我们尽量不再使用该特性。对于支持度，可以写一个polyfill：

    // 老的浏览器可能根本没有实现 mediaDevices，所以我们可以先设置一个空的对象
    if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
    }
    
    // 一些浏览器部分支持 mediaDevices。我们不能直接给对象设置 getUserMedia 
    // 因为这样可能会覆盖已有的属性。这里我们只会在没有getUserMedia属性的时候添加它。
    if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function(constraints) {
    
            // 首先，如果有getUserMedia的话，就获得它
            var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    
            // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
            if (!getUserMedia) {
                return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
            }
    
            // 否则，为老的navigator.getUserMedia方法包裹一个Promise
            return new Promise(function(resolve, reject) {
                getUserMedia.call(navigator, constraints, resolve, reject);
            });
        }
    }

[MDN-MediaDevices.getUserMedia()][1]

#### 调用

    var promise = navigator.mediaDevices.getUserMedia(constraints);

#### 成功

方法返回一个 Promise 对象，成功后会resolve回调一个 MediaStream 对象作为其参数。

#### 失败

失败包含多种情况，会回调一个 DOMException 对象作为其参数。

>AbortError［中止错误］  
尽管用户和操作系统都授予了访问设备硬件的权利，而且未出现可能抛出NotReadableError异常的硬件问题，但仍然有一些问题的出现导致了设备无法被使用。

>NotAllowedError［拒绝错误］  
用户拒绝了当前的浏览器实例的访问请求；或者用户拒绝了当前会话的访问；或者用户在全局范围内拒绝了所有媒体访问请求。

>NotFoundError［找不到错误］  
找不到满足请求参数的媒体类型。

>NotReadableError［无法读取错误］  
尽管用户已经授权使用相应的设备，操作系统上某个硬件、浏览器或者网页层面发生的错误导致设备无法被访问。

>OverConstrainedError［无法满足要求错误］  
指定的要求无法被设备满足，此异常是一个类型为OverconstrainedError的对象，拥有一个constraint属性，这个属性包含了当前无法被满足的constraint对象，还拥有一个message属性，包含了阅读友好的字符串用来说明情况。因为这个异常甚至可以在用户尚未授权使用当前设备的情况下抛出，所以应当可以当作一个探测设备能力属性的手段［fingerprinting surface］。

>SecurityError［安全错误］  
在getUserMedia() 被调用的 Document 上面，使用设备媒体被禁止。这个机制是否开启或者关闭取决于单个用户的偏好设置。

>TypeError［类型错误］  
constraints对象未设置［空］，或者都被设置为false。

不过，返回的promise对象可能既不会resolve也不会reject，因为用户不是必须选择允许或拒绝。就什么也不干了，也不会有超时。所以需要的话，需要自己设计超时逻辑了。

#### 参数：constraints

constraints 参数是一个包含了video 和 audio两个成员的MediaStreamConstraints 对象，用于说明请求的媒体类型。必须至少一个类型或者两个同时可以被指定。如果浏览器无法找到指定的媒体类型或者无法满足相对应的参数要求，那么返回的Promise对象就会处于rejected［失败］状态，NotFoundError作为rejected［失败］回调的参数。
    
    // 参数为空：
    TypeError: Failed to execute 'getUserMedia' on 'MediaDevices': At least one of audio and video must be requested
    
    // 不带任何参数的音频和视频
    { audio: true, video: true }
    
    // 视频还可以添加额外参数，分辨率：
    {
        audio: true,
        video: { width: 1280, height: 720 }
    }
    
    // 强制分辨率，可以使用关键字min, max, 或者 exact-强制(就是 min == max). 以下参数表示要求获取最低为1280x720的分辨率。
    {
        audio: true,
        video: {
            width: {
                min: 1280
            },
            height: {
                min: 720
            }
        }
    }
    
    // 还可以添加参数ideal-理想分辨率，这个参数权重更高。
    {
        audio: true,
        video: {
            width: {
                ideal: 1280
            },
            height: {
                ideal: 720
            }
        }
    }
    
    // 如果分辨率不支持，将返回的Promise会处于rejected状态，NotFoundError作为rejected回调的参数，而且不会提示用户。
    
    // 在移动设备上，还有个参数可以控制使用前后置摄像头
    // facingMode: 'user' , 'environment' 代表前后置。
    {
        audio: true,
        video: {
            facingMode: 'user'
        }
    }
    
    // 也可以加上强制参数使用：
    {
        audio: true,
        video: {
            facingMode: {
                exact: "environment"
            }
        }
    }



### Demo && Code

#### 视频捕获

[Demo][2]

二维码：

![capture][3]


#### 视频截图

[Demo][4]

二维码：

![screenshot][5]


#### 视频滤镜

[Demo][6]

二维码：

![filter][7]


[CSS3 filter][8]

#### 手机前后摄像头

用手机模式打开，PC打开为Demo1.

[Demo][9]

二维码：

![facingMode][10]


文档里有四个值，但一部分浏览器只支持 `user, environment` ，暂时还没有浏览器支持`left, right`.

[facingMode 值参考][11]

Android支持还可以，Safari支持得还不友好，需要高版本才支持。

[is WebRTC Ready ?][12]

### 历史

在做web前端中，我们发现，需要获取用户设备时，对web前端总是很艰难。基本上都是交给APP前端去做。
在web发展中，这也是前辈们一直在探索的难题。

包括不限于：

#### 1、HTML 媒体捕获

    <input type="file" accept="image/*;capture=camera">
    <input type="file" accept="video/*;capture=camcorder">
    <input type="file" accept="audio/*;capture=microphone">

现在浏览器基本转向getUserMedia了，对于这些API的支持除了某些特定版本浏览器，应该只限于取固定文件了。

#### 2、设备元素

因为上面input标签局限，很多实时的交互不能实现，后来又出现了`<device>`。

从h5语义化这一点上来说，这个标签还是设计得很合理的。但似乎没有被正式支持过。

#### 3、navigator.getUserMedia

在 WebRTC（网络即时通信）的协助下，各厂商实现了`navigator.getUserMedia`，支持访问用户本地相机/麦克风，获取媒体流。

#### 4、navigator.mediaDevices.getUserMedia

`navigator.getUserMedia` 特性已经从 Web 标准中删除，为了兼容某些浏览器还继续支持。更好的语义更强的`navigator.mediaDevices.getUserMedia`。

期待未来在web中能更好的支持捕获摄像头和麦克风，给用户更好的体验，给前端更大的空间。

### 番外

利用 Permission API 确认是否已获得某访问权。

navigator.permissions 下有个query方法可以查询。

比如你想查询是否有权访问用户的麦克风，可以将 {name: 'microphone'} 传入 query 方法，返回：

    granted — 用户之前已授予对麦克风的访问权；
    prompt — 用户尚未授予访问权，调用 getUserMedia 时将会收到提示；
    denied — 系统或用户已显式屏蔽对麦克风的访问权，您将无法获得对其的访问权。

    navigator.permissions.query({
        name: 'microphone'
    }).then(function(result) {
        if (result.state == 'granted') {
            // dosomething
        } else if (result.state == 'prompt') {
            // dosomething
        } else if (result.state == 'denied') {
            // dosomething
        } else {
            // dosomething
        }
        
        result.onchange = function() {
            // dosomething
        };
    });



[参考：getusermedia intro][13]


[参考：Web Speech API][14]

  [1]: https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/getUserMedia
  [2]: /demos/2018-10-03-getusermedia-demo.html?idx=1
  [3]: /img/qrCode/getusermedia-demo1.png
  [4]: /demos/2018-10-03-getusermedia-demo.html?idx=2
  [5]: /img/qrCode/getusermedia-demo2.png
  [6]: /demos/2018-10-03-getusermedia-demo.html?idx=3
  [7]: /img/qrCode/getusermedia-demo3.png
  [8]: https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter
  [9]: /demos/2018-10-03-getusermedia-demo.html?idx=4
  [10]: /img/qrCode/getusermedia-demo4.png
  [11]: https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/facingMode
  [12]: http://iswebrtcreadyyet.com/
  [13]: https://www.html5rocks.com/en/tutorials/getusermedia/intro/
  [14]: https://dvcs.w3.org/hg/speech-api/raw-file/9a0075d25326/speechapi.html


