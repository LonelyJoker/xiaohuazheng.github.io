---
layout:     post
title:      "自己管理node版本"
subtitle:   "不用nvm，n"
description: "nvm n node版本管理 pm2 update"
keyword:    "nvm n node版本管理 pm2 update"
date:       2020-03-28
author:     "xzavier"
catalog: true
tags:
    - Node
---

不用Nvm 和 N，我们怎么管理Node版本呢？

其实我在我的mac上还是用的nvm，也用过n进行node版本管理，升级呀切换呀什么的。

但是node人家没说一定要个node版本管理器是吧，假如你有洁癖，就是不想用这些东西，那你可以往下看看。

### 安装Node

首先下载node版本包，我们就放在 `/usr/local` 下吧

    cd /usr/local

然后下载包

    wget "https://nodejs.org/dist/v10.19.0/node-v10.19.0-linux-x64.tar.xz"

解压

    tar -xvf node-v10.19.0-linux-x64.tar.xz

添加软链接：

    sudo ln -s /usr/local/node-v10.19.0-linux-x64 /usr/local/node

修改 `.bashrc`

    vi ~/.bashrc

添加一下两行code:

    export NODE_HOME=/usr/local/node
    export PATH=$NODE_HOME/bin/:$PATH

在当前环境下生效你需要执行，或者直接关掉重新打开终端也阔以：

    source ~/.bashrc

然后查看node版本就看装没装上咯：

    node -v

### Node版本管理

yeah，我们要说的是Node版本管理，那么在同样的地方，再放一个版本包就可以了噻：

    wget "https://nodejs.org/dist/v12.16.1/node-v12.16.1-linux-x64.tar.xz"

解压

    tar -xvf node-v12.16.1-linux-x64.tar.xz

这时候我们就有 `12.16.1` 版本的包了。只需要改变软链即可改变版本。

首先删除原软链：

    rm -rf /usr/local/node

放心，这儿删除不影响你运行中的项目，那些项目已经把node环境加载进去了，服务器node版本替换删除都不影响他们。

接着，建立新的软链：

    sudo ln -s /usr/local/node-v12.16.1-linux-x64 /usr/local/node

然后查看你的node版本：

    node -v

就这样，我们的版本管理竟如此简单。但你要说和nvm这些管理起来肯定操作室，这些工具要快捷许多，但自己搞一套自己最清楚哪儿会出问题。

再写个 `ssh` 脚本来管理，也会像nvm, n那样方便快捷。

### 进程Node版本更新

当你更新好了服务器的版本，但服务器上的node进程的版本并未更新。如果需要更新进程上的版本，你需要先测试新版本对进程里的服务是否影响。在测试环境OK了再进行线上进程Node版本更新。

我们用到pm2进行Node进程管理，那么：

先保存进程：

    pm2 save

然后刷新pm2

    pm2 update 

马上去线上检查你的服务是否正常，出现异常先回退版本。

查看pm2详情：

    pm2 show yourpm2Id

### 总结

咱们自己管理node版本，其实最关键的就是改变上文提到的软链。



