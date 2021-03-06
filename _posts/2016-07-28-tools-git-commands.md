---
layout:     post
title:      "工具系列（1）- Git"
subtitle:   "Git常用命令and设置快捷命令"
description: "Git 快捷命令 常用"
keyword:    "Git 快捷命令 常用"
date:       2016-07-28
author:     "xzavier"
catalog: true
tags:
    - Git
---


### 常见命令


    初始化新版本库：git init
    全局设置：git config --global user.name "xzavier"  git config --global user.email "xzavier.xxx.com"
    克隆版本库：git clone "url"
    查看分支：git branch
    创建分支：git branch branch_name
    切换分支：git checkout branch_name
    创建+切换分支：git checkout -b branch_name
    合并某分支到当前分支：git merge branch_name
    重命名分支：git branch -m branch_name branch_new_name //不会覆盖已经存在的分支
    重命名分支：git branch -M branch_name branch_new_name //会覆盖已经存在的分支
    删除分支：git branch -d branch_name 
    强制删除分支： git branch -D branch_name
    删除远程分支： git push origin : branch_name 
    拉取代码：git pull origin branch_name
    查看更改：git status 
    查看更改细节： git diff file_name
    查看谁修改过代码： git blame filename
    回到上次修改： git reset --hard
    添加单个文件：git add filename.js 
    添加所有js文件：git add *.js
    添加所有文件：git add .
    提交添加的文件：git commit -m "your description about this branch"
    提交单个文件：git commit -m "your description about it" filename.js
    push分支：git push origin your_branch_name
    备份当前分支内容：git stash //在后面再讲讲这个
    查看历史记录：git log
    创建标签：git tag 1.0.0  //标签无法重命名
    显示标签列表：git tag 
    切出标签：git checkout 1.0.0
    删除标签：git tag -d 1.0.0
    查看git远程网址：git remote -v
    更改git远程网址：git remote set-url origin https://github.com/USERNAME/OTHERREPOSITORY.git  ; git remote set-url origin git@github.com:USERNAME/OTHERREPOSITORY.git


Git远程网址参考：[Changing a remote's URL][1]

### 终端设置Git快捷命令

如果你用的是 git bash 或者 XSHell 或者 MAC-iterm2 的话，在记住了命令含义的情况下，工作时键入快捷命令会提高工作效率。

在git bash中进入`c://User/user`，执行`touch .bashrc`，然后在此目录下会生成一个.bashrc文件，将下面的快捷命令拷入保存即可，快捷命令可自行修改添加，主要是自己习惯和喜欢。

在XSHell or iterm2 里快捷命令是在~/.bashrc中配置，在XSHell or iterm2 中 `vim ~/.bashrc`,把以上命令加到合适的位置保存（`:wq`）即可。

    alias gs='git status'
    alias gd='git diff'
    alias ga='git add'
    alias gc='git commit'
    alias gck='git checkout'
    alias gb='git branch'
    alias gl='git log'
    alias gthis='git rev-parse --abbrev-ref HEAD'
    alias gpushthis='git push origin `gthis`'
    alias gpullthis='git pull origin `gthis`'
    alias gup='git remote update'
    alias gpl='git pull origin'

### 更多git命令见此图：

![图片描述][2]

图片来源网络

### 小工作流

早上来上班,切到master分支

1. 拉一下代码：`git pull origin develop/master`
   开始写代码，肯定不能再master上写咯
   
2. 新建分支：`git checkout -b branch_name` (分支名一定要按照公司规范)
   然后工作写代码，这时候如果有别的分支上需要处理点紧急bug什么的，又不能现在提交代码，
   
3. 那就先保存起来吧: `git stash`

4. 切到别的分支修改代码 ： `git checkout -b branch_name`

5. 修复bug后提交代码查看修改：`git status`

6. 需要查看修改的细节： `git diff file_name`

7. 没有问题了，那就提交吧： `git add file_name` (一般来说你可以 git add . 点符号带便全部)
   
       git commit -m "your description about this branch"
       git push origin your_branch_name
   
8. bug算是解决了，那就回到正常的工作吧，切回原来的分支：`git chekcout -b your_old_branch`

9. 恢复刚刚保存的内容： `git stash pop` (至于这个pop,详细需要自己去找官网或者博客学习，简单介绍）

        git stash: 备份当前的工作区的内容，保存到Git栈中
        git stash pop: 从Git栈中读取最近一次保存的内容，恢复工作区的相关内容。
            由于可能存在多个Stash的内容，所以用栈来管理，pop会从最近的一个stash中读取内容并恢复。
        git stash list: 显示Git栈内的所有备份，可以利用这个列表来决定从那个地方恢复。
        git stash clear: 清空Git栈。此时使用gitg等图形化工具会发现，原来stash的哪些节点都消失了。  
    
10.代码恢复了，就开始工作了。代码写完了。需要提交代码至审核人。合并到master分支对于一个公司来说
   肯定不是每个员工都能做的，一般是运维或者项目助理（不多说了，一旦合并master时遇到冲突，就会找相应开发人员解决冲突，冲突一般是多个开发员修改了同一处代码造成的）

11.这时候拉去master(对方也没合master就商量好拉他的代码，最后只把你这个分支提交就行了)：

       git git pull origin master 或者 pull origin his/her_branch_name
        出现：Auto-merging readme.txt
              CONFLICT (content): Merge conflict in readme.txt

12.看到conflict（冲突）,找到相应文件，出现这样的地方：
    
    <<<<<<< HEAD 
    others_branch
    =======
    解决冲突
    >>>>>>yours_branch

13.解决好冲突后提交即可





  [1]: https://help.github.com/articles/changing-a-remote-s-url/
  [2]: https://raw.githubusercontent.com/xiaohuazheng/twbm/master/articles/img/git_commonds.png
