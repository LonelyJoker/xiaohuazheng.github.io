---
layout:     post
title:      "Web Speech 语音 && 麦克风"
subtitle:   "SpeechSynthesisUtterance SpeechSynthesis SpeechRecognition"
description: "前端实现语音朗读"
keyword:    "Web Speech SpeechSynthesisUtterance SpeechSynthesis SpeechRecognition"
date:       2019-09-29
author:     "xzavier"
catalog: true
tags:
    - Javascript
---



### Use It

#### 语音朗读

控制台输入下面代码实现语音朗读：

        let ssu = new SpeechSynthesisUtterance();
        ssu.text = 'hello, xzavier.'
        
        window.speechSynthesis.speak(ssu);

实际使用中，可通过`volume, rate, pitch, voice, lang`等调节参数，变幻出不同的语音效果，达到变声，快读，慢读等效果。前端未来可期。

#### 语音识别

控制台输入下面代码实现语音识别（默认英文，需要翻墙）：

    let final_transcript = "";
    let wSR = new webkitSpeechRecognition();
    wSR.continuous = true;
    wSR.interimResults = true;
    
    wSR.onresult = function(event) {
        let interim_transcript = ''; 
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }
    }
    wSR.onend = function(e) {
        console.log(final_transcript);
    }
    wSR.start();

录音完执行：

    wSR.stop();

改变`lang`属性可以实现识别其他语种，比如中文、其他国家语言等。语音识别从来没有在前端实现过，有了这个API，前端就更加丰富多彩了。期待更好的支持和不需要翻墙的未来。

### Demo && Code

#### 语音朗读

[Demo][1]

二维码：

![vSpeechSynthesis][2]

Android支持不友好，IOS微信扫码或者Safari打开测试可行。

#### 语音识别

[Demo][3]

二维码：

![SpeechRecognition][4]

Android支持不友好，IOS暂不支持。

PC测试需要翻墙哟，短期内手机端支持了应该也需要翻墙。不翻墙无法获取到识别结果。

### SpeechSynthesisUtterance

用于合成语音的接口。

#### Properties

>`lang`  
Gets and sets the language of the utterance.
语言

>`pitch`  
Gets and sets the pitch at which the utterance will be spoken at.
音高 

>`rate`
Gets and sets the speed at which the utterance will be spoken at.
语速

>`text`  
Gets and sets the text that will be synthesised when the utterance is spoken.
文本

>`voice`  
Gets and sets the voice that will be used to speak the utterance.
支持语音 - 通过 getVoices() 可以获取到语音包列表

>`volume`  
Gets and sets the volume that the utterance will be spoken at.
音量

#### Event handlers

>`onboundary`  
Fired when the spoken utterance reaches a word or sentence boundary.
监听遇到单词或句子边界时触发

>`onend`  
Fired when the utterance has finished being spoken.
监听结束时触发

>`onerror`  
Fired when an error occurs that prevents the utterance from being succesfully spoken.
监听错误发生时触发

>`onmark`  
Fired when the spoken utterance reaches a named SSML "mark" tag.
监听有SSML文档合成的语音标记出现时触发

>`onpause`  
Fired when the utterance is paused part way through.
监听暂停时触发

>`onresume`  
Fired when a paused utterance is resumed.
监听重新播放时触发（限于暂停后的重新播放）

>`onstart`  
Fired when the utterance has begun to be spoken.
监听开始时触发

[参考：SpeechSynthesisUtterance][5]

### SpeechSynthesis

语音播放接口，可播放SpeechSynthesisUtterance合成的语音。

#### Properties

>`paused (Read only)`  
A Boolean that returns true if the SpeechSynthesis object is in a paused state.
是否暂停暂停状态(true/false)

>`pending (Read only)`  
A Boolean that returns true if the utterance queue contains as-yet-unspoken utterances.
是否还有未处理好的语句，等待处理中状态(true/false)

>`speaking (Read only)`  
A Boolean that returns true if an utterance is currently in the process of being spoken — even if SpeechSynthesis is in a paused state.
是否正在播放中状态(true/false)

#### Event handlers

>`onvoiceschanged`  
Fired when the list of SpeechSynthesisVoice objects that would be returned by the SpeechSynthesis.getVoices() method has changed.
监听播放的声音改变时。通过 SpeechSynthesis.getVoices() 获取到语音包列表。

#### Methods

>`cancel()`  
Removes all utterances from the utterance queue.
停止播放，清除声音队列。

>`getVoices()`  
Returns a list of SpeechSynthesisVoice objects representing all the available voices on the current device.
获取到语音包列表。

>`pause()`  
Puts the SpeechSynthesis object into a paused state.
暂停播放。

>`resume()`  
Puts the SpeechSynthesis object into a non-paused state: resumes it if it was already paused.
继续播放。

>`speak()`  
Adds an utterance to the utterance queue; it will be spoken when any other utterances queued before it have been spoken.
播放声音。

[参考：SpeechSynthesis][6]


### webkitSpeechRecognition

语音识别服务。

#### Properties

>`grammars`  
Returns and sets a collection of SpeechGrammar objects that represent the grammars that will be understood by the current SpeechRecognition.
设定语法。

    var grammar = '#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;'
    var recognition = new webkitSpeechRecognition();
    var speechRecognitionList = new webkitSpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;

>`lang`  
Returns and sets the language of the current SpeechRecognition. If not specified, this defaults to the HTML lang attribute value, or the user agent's language setting if that isn't set either.
设定要识别的语言。

>`continuous`  
Controls whether continuous results are returned for each recognition, or only a single result. Defaults to single (false.)
设定是否连续识别模式。

>`interimResults`  
Controls whether interim results should be returned (true) or not (false.) Interim results are results that are not yet final (e.g. the SpeechRecognitionResult.isFinal property is false.)
设定是否输出中间结果。

>`maxAlternatives`  
Sets the maximum number of SpeechRecognitionAlternatives provided per result. The default value is 1.
设定最大语音匹配结果个数。

>`serviceURI`  
Specifies the location of the speech recognition service used by the current SpeechRecognition to handle the actual recognition. The default is the user agent's default speech service.
设定当前SpeechRecognition用于处理语音识别的服务的位置。默认值是用户代理的默认语音服务。

#### Event handlers

>`onaudiostart`  
Fired when the user agent has started to capture audio.
监听开始捕获音频时触发。

>`onaudioend`  
Fired when the user agent has finished capturing audio.
监听结束捕获音频时触发。

>`onsoundstart`  
Fired when any sound — recognisable speech or not — has been detected.
监听检测到任何声音可识别的语音时触发。

>`onsoundend`  
Fired when any sound — recognisable speech or not — has stopped being detected.
监听没有任何可识别的语音时触发。

>`onspeechstart`  
Fired when sound that is recognised by the speech recognition service as speech has been detected.
检测语音服务开始识别时触发。

>`onspeechend`  
Fired when speech recognised by the speech recognition service has stopped being detected.
检测语音服务停止识别时触发。

>`onstart`  
Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
监听SpeechRecognition开始时触发

>`onend`  
Fired when the speech recognition service has disconnected.
监听SpeechRecognition结束时触发。

    以上触发顺序为：
    onstart
    onaudiostart
    onsoundstart
    onspeechstart
    onspeechend
    onsoundend
    onaudioend
    onend

>`onerror`  
Fired when a speech recognition error occurs.
监听出错时触发。

>`onnomatch`  
Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
监听无匹配时触发。

>`onresult`  
Fired when the speech recognition service returns a result — a word or phrase has been positively recognized and this has been communicated back to the app.
监听识别有任何结果时触发。

结果返回在返回函数的event参数里，形式如下：

    {
        ..
        results: {
            0: {
                0: {
                    confidence: 0.695017397403717,
                    transcript: "look Mum I'm talking into a web page!"
                },
                isFinal:true,
                length:1
            },
            length:1
        },
        ..
    }

目前需要翻墙才能触发这个收到结果。

#### Methods

>`abort()`  
Stops the speech recognition service from listening to incoming audio, and doesn't attempt to return a SpeechRecognitionResult.
停止服务，并且不会反回已识别的结果。

>`start()`  
Starts the speech recognition service listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
开始监听语音并识别。

>`stop()`  
Stops the speech recognition service from listening to incoming audio, and attempts to return a SpeechRecognitionResult using the audio captured so far.
停止监听语音并反回已识别的结果。



[参考：SpeechRecognition][7]

[参考：webkitSpeechRecognition][8]


[参考：Web Speech API][9]

  [1]: /demos/2018-09-28-web-speech-demo.html
  [2]: /img/qrCode/web-speech-demo.png
  [3]: /demos/2018-09-29-web-speech-recognition-demo.html
  [4]: /img/qrCode/web-speech-recognition-demo.png
  [5]: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance
  [6]: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
  [7]: https://shapeshed.com/html5-speech-recognition-api/
  [8]: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
  [9]: https://dvcs.w3.org/hg/speech-api/raw-file/9a0075d25326/speechapi.html


