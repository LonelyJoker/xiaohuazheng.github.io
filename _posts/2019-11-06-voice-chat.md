---
layout:     post
title:      "前端捕获麦克风录音 && 语音聊天"
subtitle:   "Capturing Audio && Voice Chat"
description: "前端捕获麦克风录音 实现语音聊天"
keyword:    "navigator.mediaDevices.getUserMedia 捕获麦克风 摄像头 RecordRTC"
date:       2019-11-06
author:     "xzavier"
catalog: true
tags:
    - Javascript
---


### Demo && Code

#### 语音聊天

[Demo][1]

二维码：

![Voice Chat][2]

Android Chrome支持OK，IOS微信扫码然后用Safari打开测试，需要IOS11以上。


### 思路

目前主要思路为：

>1、navigator.mediaDevices.getUserMedia捕获用户麦克风，获取录音数据；

>2、处理音频流最后将数据转换为可播放的数据；

>3、用audio标签进行播放。

### 捕获麦克风

navigator.mediaDevices.getUserMedia 的使用参考[捕获用户麦克风 && 摄像头][3]

    function startRecord() {
        recording = true;
        // 重置数据缓冲区
        leftchannel.length = rightchannel.length = 0;
        recordingLength = 0;
        
        // 断开上一个连接和录音捕获
        try {
            localMediaStream.getTracks()[0].stop();
            audioInput.disconnect();
            recorder.disconnect();
        } catch(e) {}
    
        navigator.mediaDevices.getUserMedia({audio:{
            sampleRate: 44000,
            channelCount: 2,
            volume: 1.0
        }}).then(function(e) {
            onSuccess(e);
            localMediaStream = e;
        }, function(error) {
            console.log(error);
        });
    }


### 处理音频流

接着对音频流进行处理。利用 Web Audio API 处理数据。 Web Audio API 是一个简单的 API，用于获取输入源并将这些输入源连接到可以处理音频数据（调节增益等）的节点，最终目的是连接到扬声器以便用户能够听到声音。

可以连接的其中一个节点是 ScriptProcessorNode。每次音频缓冲区已满，需要您进行处理时，该节点都会发出一个 onaudioprocess 事件。此时，您可以将数据保存到自己的缓冲区内，留供以后使用。

    function onSuccess(e){
        audioContext = window.AudioContext || window.webkitAudioContext;
        context = new audioContext();
    
        // 设置采样率，根据查询上下文采样率（因平台而异）
        sampleRate = context.sampleRate;
    
        // 创建 gain 节点
        volume = context.createGain();
    
        // 从麦克风输入流创建音频节点
        audioInput = context.createMediaStreamSource(e);
    
        // 将流连接到 gain 节点
        audioInput.connect(volume);
    
        var bufferSize = 2048;
        recorder = context.createScriptProcessor(bufferSize, 2, 2);
    
        recorder.onaudioprocess = function(e){
            if (!recording) return;
            var left = e.inputBuffer.getChannelData (0);
            var right = e.inputBuffer.getChannelData (1);
            
            leftchannel.push (new Float32Array (left.slice(0)));
            rightchannel.push (new Float32Array (right.slice(0)));
            recordingLength += bufferSize;
        }
    
        // 连接录音设备
        volume.connect (recorder);
        recorder.connect (context.destination); 
    }


[AudioContext][4]

onaudioprocess 会不断触发，我们可以打印发现，录音的数据表示声音的强弱，声波被麦克风转换为不同强度的电流信号，这些数字就代表了信号的强弱。它的取值范围是[-1, 1]，表示一个相对比例。

保留在缓冲区内的数据是来自麦克风的原始数据，在这些数据的处理上有以下这几种选择：

>将其直接上传至服务器

>将其存储在本地

>将其转换为专用文件格式（例如 WAV），然后保存至服务器或本地


### 处理数据

录好一段语音，便可以把保存好的音频流数据转换成可播放的二进制数据。

    function endRecord() {
        try {
            localMediaStream.getTracks()[0].stop();
            audioInput.disconnect();
            recorder.disconnect();
        } catch(e) {}
        
        recording = false;
        startTime = 0;
    
        // 将左右通道向下平放
        var leftBuffer = mergeBuffers ( leftchannel, recordingLength );
        var rightBuffer = mergeBuffers ( rightchannel, recordingLength );
        // 交叉合并左右声道
        var interleaved = interleave ( leftBuffer, rightBuffer );
    
        // 创建buffer
        var buffer = new ArrayBuffer(44 + interleaved.length * 2);
        
        // 创建DataView视图
        var view = new DataView(buffer);
    
        // 写入资源交换文件标识符
        writeUTFBytes(view, 0, 'RIFF');
        // 设置下个地址开始到文件尾总字节数
        view.setUint32(4, 44 + interleaved.length * 2, true);
        // 写入WAV文件标志
        writeUTFBytes(view, 8, 'WAVE');
        // FMT 格式标志
        writeUTFBytes(view, 12, 'fmt ');
        // 设置过滤字节,一般为 0x10 = 16
        view.setUint32(16, 16, true);
        // 设置格式类别 (PCM形式采样数据)
        view.setUint16(20, 1, true);
        // 设置通道数 (2 channels)
        view.setUint16(22, 2, true);
        // 设置采样率，每秒样本数，表示每个通道的播放速度
        view.setUint32(24, sampleRate, true);
        // 波形数据传输率 (每秒平均字节数) 
        view.setUint32(28, sampleRate * 4, true);
        // 设置快数据调整数 采样一次占用字节数
        view.setUint16(32, 4, true);
        // 设置单个样本数据位数
        view.setUint16(34, 16, true);
        // 数据标识符 sub-chunk
        writeUTFBytes(view, 36, 'data');
        // 设置采样数据总数
        view.setUint32(40, interleaved.length * 2, true);
    
        // 写入采样数据
        var lng = interleaved.length;
        var index = 44;
        var volume = 1;
        for (var i = 0; i < lng; i++){
            view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
            index += 2;
        }
    
        // 转换BLOB
        var blob = new Blob ( [ view ], { type : 'audio/mpeg' } );
    
        //  blob 形式播放
        // voiceBox.find('audio')[0].src = URL.createObjectURL(blob);
        // $room.append(voiceBox);
        // vc.initVoice();
    
        
        var reader = new FileReader();
        reader.onload = function(event){
            voiceBox.find('audio')[0].src = event.target.result;
            $room.append(voiceBox);
        };
        // 转换base64
        reader.readAsDataURL(blob);
    }
    
    // 合并多个Float32Array成一个单个Float32Array
    function mergeBuffers(channelBuffer, recordingLength){
        var result = new Float32Array(recordingLength);
        var offset = 0;
        var lng = channelBuffer.length;
        for (var i = 0; i < lng; i++){
            var buffer = channelBuffer[i];
            result.set(buffer, offset);
            offset += buffer.length;
        }
        return result;
    }
    
    // 交叉合并左右声道数据
    // 因为wav格式存储的时候不是先放左声道再放右声道的
    // 是一个左声道数据，一个右声道数据交叉放的
    function interleave(leftChannel, rightChannel){
        var length = leftChannel.length + rightChannel.length;
        var result = new Float32Array(length);
    
        var inputIndex = 0;
    
        for (var index = 0; index < length;){
            result[index++] = leftChannel[inputIndex];
            result[index++] = rightChannel[inputIndex];
            inputIndex++;
        }
        return result;
    }

[ArrayBuffer][5]

[DataView][6]

[Blob][7]

[二进制数组][8]

### 播放

我们已经把录音的数据赋值给了audio的src，接下来就是处理下播放的效果和页面了。

    var vc = {
        init: function() {
            this.bindEvents();
            this.voice = {};
            this.initVoice();
        },
        bindEvents: function() {
            var _this = this;
            // 音频点击
            $(document).on('click', '.voice-one', function() {
                var $this = $(this),
                    vid = $this.attr('vid');
                if ($this.hasClass('playing')) {
                    _this.stopPlay(vid);
                } else {
                    _this.startPlay(vid);
                }
            });
        },
        // 初始化音频
        initVoice: function() {
            var _this = this;
    
            if (!$('.voice-init').length) {
                return;
            }
    
            function renderDuration(v) {
                if ($('.voice-one[vid="'+v+'"]').find('.duration').hasClass('ed')) {
                    return;
                }
    
                if ($.isNumeric(_this.voice[v].duration)) {
                    var d = Math.ceil(_this.voice[v].duration);
                    $('.voice-one[vid="'+v+'"]').find('.duration').html(d + '"').addClass('ed');
    
                    if (d > 3) {
                        if (d > 35) {
                            $('.voice-one[vid="'+v+'"]').css('width', '70%');
                        } else {
                            $('.voice-one[vid="'+v+'"]').css('width', (2 * d) + '%');
                        }
                    }
                }
            }
    
            $('.voice-init').each(function() {
                var $this = $(this),
                    vid = $this.attr('vid'),
                    vSelector = 'voice-' + vid;
    
                _this.voice[vid] = document.getElementById(vSelector);
                // 监听音频数据加载
                _this.voice[vid].addEventListener('loadeddata', function() {
                    renderDuration(vid);
                });
                _this.voice[vid].addEventListener('canplay', function() {
                    renderDuration(vid);
                });
                _this.voice[vid].addEventListener('timeupdate', function() {
                    renderDuration(vid);
                });
                _this.voice[vid].addEventListener('durationchange', function() {
                    renderDuration(vid);
                });
                _this.voice[vid].addEventListener('canplaythrough', function() {
                    renderDuration(vid);
                });
                _this.voice[vid].addEventListener('loadedmetadata', function() {
                    renderDuration(vid);
                });
    
                // 监听音频播放完毕
                _this.voice[vid].addEventListener('ended', function() {
                    _this.voice[vid].currentTime = 0;
                    _this.stopPlay(vid);
                });
    
                $this.removeClass('voice-init');
            });
            
            // 页面隐藏时停止播放
            var visProp = _this.getHackHidden();
            if (visProp) {
                var evtname = visProp.replace(/[H|h]idden/, '') + 'visibilitychange';
                document.addEventListener(evtname, function() {
                    if (_this.isHidden() || _this.getHackVisibilityState() === 'hidden') {
                        _this.closeAllVoice();
                    }
                }, false);
            }
    
            // 即将离开时触发
            window.addEventListener('beforeunload', function() {
                _this.closeAllVoice();
            }, false);
    
            // 离开时触发
            window.addEventListener('unload', function() {
                _this.closeAllVoice();
            }, false);
        },
        // 关闭所有音频
        closeAllVoice: function(vid) {
            for(var i in this.voice) {
                if (vid != i) {
                    this.stopPlay(i);
                }
            }
        },
        // 开始音频播放效果
        startPlay: function(vid) {
            this.closeAllVoice(vid);
            this.voice[vid].play();
            $('.voice-one[vid="'+vid+'"]').addClass('playing');
        },
        // 暂停音频播放效果
        stopPlay: function(vid) {
            this.voice[vid].pause();
            $('.voice-one[vid="'+vid+'"]').removeClass('playing');
        },
        getHackHidden: function() {
            if ('hidden' in document) {
                return 'hidden';
            }
    
            var prefixes = ['webkit', 'moz', 'ms', 'o'];
            for (var i = 0; i < prefixes.length; i++) {
                if ((prefixes[i] + 'Hidden') in document) {
                    return prefixes[i] + 'Hidden';
                }
            }
            return null;
        },
        getHackVisibilityState: function() {
            if ('visibilityState' in document) {
                return 'visibilityState';
            }
    
            var prefixes = ['webkit', 'moz', 'ms', 'o'];
            for (var i = 0; i < prefixes.length; i++) {
                if ((prefixes[i] + 'VisibilityState') in document) {
                    return prefixes[i] + 'VisibilityState';
                }
            }
            return null;
        },
        isHidden: function() {
            var prop = this.getHackHidden();
            if (!prop) {
                return false;
            }
        
            return document[prop];
        }
    }
    
    vc.init();

[如何实现前端录音功能 - 掘金文章][9]

[RecordRTC库，里面的许多例子非常不错][10]

当前测试的机型较少，目前Android的Chrome和IOS11以上的Safari是比较流畅OK的。

### 未来

对这个功能的研究不会止步于此，未来还要持续关注和优化。

对了，还要解决那个我暂时还没有找到原因的，navigator.mediaDevices.getUserMedia 调用超过5次就不调用了，也不报错的问题。

感谢阅读。


  [1]: /demos/2018-10-06-voice-chat-demo.html
  [2]: /img/qrCode/voice-chat-demo.png
  [3]: /2018/10/03/getusermedia/
  [4]: https://developer.mozilla.org/zh-CN/docs/Web/API/AudioContext
  [5]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
  [6]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/DataView
  [7]: https://developer.mozilla.org/zh-CN/docs/Web/API/Blob
  [8]: http://javascript.ruanyifeng.com/stdlib/arraybuffer.html
  [9]: https://juejin.im/post/5b8bf7e3e51d4538c210c6b0
  [10]: https://github.com/muaz-khan/RecordRTC


